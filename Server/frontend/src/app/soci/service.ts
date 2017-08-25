import { Injectable } from '@angular/core'
import { Socio } from '../common/socio'

import { CdL } from '../common/CdL'
import { CorsiService } from '../corsi/service'

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

const SOCI: Socio[] = [
  new Socio({
    id: 1, nome: 'nome', cognome: 'cognome', email: 'email', cellulare: 'cellulare',
    studente: true, facebook: 'fb', matricola: 'matr'
  }),
  new Socio({
    id: 2, nome: 'nome', cognome: 'cognome', email: 'email', cellulare: 'cellulare',
    studente: false, facebook: 'fb', professione: 'prof'
  })
]

@Injectable()
export class SociService {

  private _obs: BehaviorSubject<Socio[]>;

  constructor(private _corsisrv: CorsiService) {
    _corsisrv.getCorsi().then(
      (corsi: CdL[]) => {
        let i: number = 0;
        SOCI.forEach(
          (socio: Socio) => {
            if (socio.studente) {
              socio.cdl = corsi[i];
              i = (i + 1) % corsi.length
            }
          }
        )
      }
    )
    this._obs = new BehaviorSubject<Socio[]>(SOCI);
  }


  getSoci(): Observable<Socio[]> {
    return this._obs;
  }

  updateSocio(newSocio: Socio) {
    let index = SOCI.findIndex((temp: Socio) => { return temp.id == newSocio.id });
    if (index == -1) {
      SOCI.push(newSocio);
    } else {
      Object.assign(SOCI[index], newSocio);
    }
  }

  addSocio(newSocio: Socio) {
    let index = SOCI.findIndex((temp: Socio) => { return temp.id == newSocio.id });
    //let maxId = Math.max.apply(null, SOCI.map(socio => socio.id));
    if (index == -1) {
      //newSocio.id = maxId + 1;
      SOCI.push(newSocio);
    }
    this._obs.next(SOCI);
  }
}
