import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

import { Tesseramento } from '../model'

import { HTTP_GLOBAL_OPTIONS } from '../common'


import { Observable } from 'rxjs/Observable';
import { NextObserver, ErrorObserver } from 'rxjs/Observer'
import { Subject } from 'rxjs/Subject';
import 'rxjs/Rx';

const REST_ENDPOINT: string = "https://www.studentingegneria.it/socisi/backend/tesseramento.php"

@Injectable()
export class TesseramentiService {

    tesseramentiSub: Subject<Tesseramento[]> = new Subject<Tesseramento[]>();

    constructor(private http: HttpClient) { }

    private httpObserver: NextObserver<Tesseramento[]> | ErrorObserver<Tesseramento[]> = {
        next: (value) => { this.updateSub(value); },
        error: (error) => { this.tesseramentiSub.error(error); }
    }

    private updateSub(value: Tesseramento[]): void {
        let temp : Tesseramento[] = [];
        value.forEach(
            (old) => {temp.push(new Tesseramento(old));}
        )
        this.tesseramentiSub.next(temp);
    }

    getTesseramentoAttivo(): Observable<Tesseramento> {
        return this.getTesseramenti().map(
            (tArr: Tesseramento[]) => {
                let filtered = tArr.filter((tes: Tesseramento) => { return tes.aperto });
                if (filtered.length == 1) {
                    return filtered[0];
                } else {
                    throw new Error("Nessun tesseramento attivo");
                }
            }
        )
    }

    getTesseramenti(): Observable<Tesseramento[]> {
        this.http.get<Tesseramento[]>(REST_ENDPOINT, HTTP_GLOBAL_OPTIONS).subscribe(this.httpObserver);
        return this.tesseramentiSub;
    }

    chiudiTesseramento(): void {
        this.http.post<Tesseramento[]>(
            REST_ENDPOINT,
            { action: 'close' },
            HTTP_GLOBAL_OPTIONS
        ).subscribe(this.httpObserver);
    }

    attivaNuovoTesseramento(nuovoAnno: string): void {
        this.http.post<Tesseramento[]>(
            REST_ENDPOINT,
            { action: 'open', anno: nuovoAnno },
            HTTP_GLOBAL_OPTIONS
        ).subscribe(this.httpObserver);
    }

    modificaTesseramento(t: Tesseramento){
        this.http.post<Tesseramento[]>(
            REST_ENDPOINT,
            { action: 'edit', anno: t.anno, id: t.id },
            HTTP_GLOBAL_OPTIONS
        ).subscribe(this.httpObserver);
    }
}