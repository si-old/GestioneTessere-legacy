import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

import { Tesseramento } from '../common/all'
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/Rx';

const TESSERAMENTI: Tesseramento[] = [
    new Tesseramento({anno: "2017", attivo: true}),
    new Tesseramento({anno: "2016", attivo: false}),
    new Tesseramento({anno: "2015", attivo: false}),
    new Tesseramento({anno: "2014", attivo: false}),
]

@Injectable()
export class TesseramentiService{

    tesseramentiSub: BehaviorSubject<Tesseramento[]> = new BehaviorSubject<Tesseramento[]>(TESSERAMENTI);
   
    constructor(private http: HttpClient) { }

    private get tesseramentoAttivo(): Tesseramento{
        let filtered = TESSERAMENTI.filter( (tes: Tesseramento) => { return tes.attivo });
        if(filtered.length == 1){
            return filtered[0];
        }else if(filtered.length > 1){
            console.warn("Errore, più di un tesseramento attivo");
        }else{
            console.warn("Errore, nessun tesseramento attivo");
        }
        return null;
    }

    getTesseramentoAttivo(): Observable<Tesseramento>{
        return Observable.of(this.tesseramentoAttivo);
    }

    getTesseramenti(): Observable<Tesseramento[]> {
        //return this.http.get<Tesseramento[]>('http://www.studentingegneria.it/socisi/backend/tesseramento.php');
        return this.tesseramentiSub;
    }

    chiudiTesseramento(): boolean{
        let tessAttivo: Tesseramento = this.tesseramentoAttivo;
        if(tessAttivo && tessAttivo.attivo){
            tessAttivo.attivo = false;
            this.tesseramentiSub.next(TESSERAMENTI);
            return true;
        }else{
            return false;
        }
    }

    attivaNuovoTesseramento(nuovoAnno: string): Observable<Tesseramento>{
        this.chiudiTesseramento();
        TESSERAMENTI.unshift(new Tesseramento({anno: nuovoAnno, attivo: true}));
        this.tesseramentiSub.next(TESSERAMENTI);
        return this.getTesseramentoAttivo();
    }
}