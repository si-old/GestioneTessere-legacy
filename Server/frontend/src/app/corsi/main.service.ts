import { Injectable } from '@angular/core'

import { CdL } from '../common/all'

import { Observable } from 'rxjs/Observable'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'

export const CORSI: CdL[] = [
    new CdL({ id: 1, nome: "Ing. Informatica" }),
    new CdL({ id: 2, nome: "Ing. Elettronica" }),
    new CdL({ id: 3, nome: "Ing. Meccanica" }),
    new CdL({ id: 4, nome: "Ing. Gestionale" }),
    new CdL({ id: 5, nome: "Ing. Civile" }),
    new CdL({ id: 6, nome: "Ing. Ambientale" }),
    new CdL({ id: 7, nome: "Ing. Edile" }),
    new CdL({ id: 8, nome: "Ing. Chimica" })
]

@Injectable()
export class CorsiService{

    _obs = new BehaviorSubject<CdL[]>(CORSI);

    getCorsi(): Observable<CdL[]>{
        return this._obs;
    }

    updateCorso(newCorso: CdL){
        let index = CORSI.findIndex( (temp: CdL) => { return temp.id == newCorso.id } );
        if(index != -1){
          Object.assign(CORSI[index], newCorso);
          this._obs.next(CORSI);
        }
    }
}