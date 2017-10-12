import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

import { Tesseramento } from '../model/all'
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/Rx';

const REST_ENDPOINT: string = "https://www.studentingegneria.it/socisi/backend/tesseramento.php"

@Injectable()
export class TesseramentiService {

    tesseramentiSub: Subject<Tesseramento[]> = new Subject<Tesseramento[]>();

    constructor(private http: HttpClient) { }


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
                let filtered = tArr.filter((tes: Tesseramento) => { return tes.attivo });
                if (filtered.length == 1) {
                    return filtered[0];
                } else {
                    throw new Error("Nessun tesseramento attivo")
                }
            }
        )
    }

    getTesseramenti(): Observable<Tesseramento[]> {
        this.http.get<Tesseramento[]>(REST_ENDPOINT).subscribe(
            (value) => { this.updateSub(value) }
        );
        return this.tesseramentiSub;
    }

    chiudiTesseramento(): void {
        this.http.post<Tesseramento[]>(
            REST_ENDPOINT,
            { action: 'close' }
        ).subscribe(
            (value) => { this.updateSub(value) },
        );
    }

    attivaNuovoTesseramento(nuovoAnno: string): void {
        this.http.post<Tesseramento[]>(
            REST_ENDPOINT,
            { action: 'open', anno: nuovoAnno }
        ).subscribe(
            (value) => { this.updateSub(value) }
        );
    }
}