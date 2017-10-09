import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

import { Tesseramento } from '../model/all'
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/Rx';


let next_id = 5;
const TESSERAMENTI: Tesseramento[] = [
    new Tesseramento({ id: 1, anno: "2017", attivo: true }),
    new Tesseramento({ id: 2, anno: "2016", attivo: false }),
    new Tesseramento({ id: 3, anno: "2015", attivo: false }),
    new Tesseramento({ id: 4, anno: "2014", attivo: false }),
]

@Injectable()
export class TesseramentiService {

    tesseramentiSub: BehaviorSubject<Tesseramento[]> = new BehaviorSubject<Tesseramento[]>(TESSERAMENTI);

    constructor(private http: HttpClient) { }

    private get tesseramentoAttivo(): Tesseramento {
        let filtered = TESSERAMENTI.filter((tes: Tesseramento) => { return tes.attivo });
        if (filtered.length == 1) {
            return filtered[0];
        }
        return null;
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
        //return this.http.get<Tesseramento[]>('http://www.studentingegneria.it/socisi/backend/tesseramento.php');
        return this.tesseramentiSub
    }

    _chiudiTesseramentoAtt(){
        let tessAttivo: Tesseramento = this.tesseramentoAttivo;
        if (tessAttivo && tessAttivo.attivo) {
            tessAttivo.attivo = false;
            return true;
        } else {
            return false;
        }
    }

    chiudiTesseramento(): boolean {
        let toReturn = this._chiudiTesseramentoAtt();
        if (toReturn){
            this.tesseramentiSub.next(TESSERAMENTI);
        }
        return toReturn;
    }

    attivaNuovoTesseramento(nuovoAnno: string): Observable<Tesseramento> {
        this._chiudiTesseramentoAtt();
        TESSERAMENTI.unshift(new Tesseramento({ id: next_id, anno: nuovoAnno, attivo: true }));
        next_id = next_id + 1;
        this.tesseramentiSub.next(TESSERAMENTI);
        return this.getTesseramentoAttivo();
    }
}