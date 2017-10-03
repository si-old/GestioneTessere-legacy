import { Injectable } from '@angular/core'

import { MembroDirettivo, Carriera, Tessera } from '../common/all'

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


const DIRETTIVO: MembroDirettivo[] = [
    new MembroDirettivo({
        id: 1, nome: 'nome', cognome: 'cognome', email: 'email', cellulare: 'cellulare', user: 'nome1', password: 'pass1',
        facebook: 'fb', carriere: [new Carriera({ id: 1, studente: true, matricola: 'matr' }), new Carriera({ id: 2, studente: true, matricola: 'matr' }),
        new Carriera({ id: 3, studente: true, matricola: 'matr' }), new Carriera({ id: 4, studente: true, matricola: 'matr' }),
        new Carriera({ id: 5, studente: true, matricola: 'matr' })],
        tessere: [new Tessera({ id: 1, numero: '0', anno: null })]
    }),
    new MembroDirettivo({
        id: 2, nome: 'nome', cognome: 'cognome', email: 'email', cellulare: 'cellulare', facebook: 'fb', user: 'nome2', password: 'pass2',
        tessere: [new Tessera({ id: 2, numero: '1', anno: null }), new Tessera({ id: 3, numero: '1', anno: null }), new Tessera({ id: 4, numero: '1', anno: null })],
        carriere: [new Carriera({ id: 6, studente: false, professione: 'prof' })]
    })
]

@Injectable()
export class DirettivoService {

    _obs = new BehaviorSubject<MembroDirettivo[]>(DIRETTIVO)

    getDirettivo(): Observable<MembroDirettivo[]> {
        return this._obs;
    }

    deleteMembro(m: MembroDirettivo){
        let found = -1;
        DIRETTIVO.forEach(
            (x: MembroDirettivo, i: number) => { if (x.id == m.id) found = i;}
        )
        if(found >= 0){
            DIRETTIVO.splice(found, 1);
            this._obs.next(DIRETTIVO);
        }
    }

}