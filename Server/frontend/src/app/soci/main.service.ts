import { Injectable } from '@angular/core'

import { Socio, Carriera, Tessera, CdL, Tesseramento } from '../common/all'

import { CorsiService } from '../corsi/main.service'
import { TesseramentiService } from '../tesseramenti/main.service'

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

const SOCI: Socio[] = [
  new Socio({
    id: 1, nome: 'nome', cognome: 'cognome', email: 'email', cellulare: 'cellulare',
    facebook: 'fb', carriere: [new Carriera({ id: 1, studente: true, matricola: 'matr' }), new Carriera({ id: 2, studente: true, matricola: 'matr' }),
    new Carriera({ id: 3, studente: true, matricola: 'matr' }), new Carriera({ id: 4, studente: true, matricola: 'matr' }),
    new Carriera({ id: 5, studente: true, matricola: 'matr' })],
    tessere: [new Tessera({ id: 1, numero: '0', anno: null })]
  }),
  new Socio({
    id: 2, nome: 'nome', cognome: 'cognome', email: 'email', cellulare: 'cellulare', facebook: 'fb',
    tessere: [new Tessera({ id: 2, numero: '1', anno: null }), new Tessera({ id: 3, numero: '1', anno: null }), new Tessera({ id: 4, numero: '1', anno: null })],
    carriere: [new Carriera({ id: 6, studente: false, professione: 'prof' })]
  })
]

@Injectable()
export class SociService {

  private _obs: BehaviorSubject<Socio[]>;

  private corsi: CdL[];

  constructor(private _corsisrv: CorsiService, private _tesssrv: TesseramentiService) {
    this._tesssrv.getTesseramenti().combineLatest(
      _corsisrv.getCorsi(),
      (tesseramenti_in: Tesseramento[], corsi_in: CdL[]) => { return { corsi: corsi_in, tesseramenti: tesseramenti_in } }
    ).first().subscribe(
      (x) => {
        let i: number = 0;
        SOCI.forEach(
          (socio: Socio) => {
            socio.carriere.forEach(
              (carriera: Carriera) => {
                if (carriera.studente) {
                  carriera.corso = x.corsi[i];
                  i = (i + 1) % x.corsi.length
                }
              }
            )
            socio.tessere.forEach(
              (tessera: Tessera, index: number) => {
                let mod = x.tesseramenti.length - 1;
                tessera.anno = (index == 0) ? x.tesseramenti[0] : x.tesseramenti[(index % mod) + 1];
              }
            )
          }
        )
      }
      )
    this._obs = new BehaviorSubject<Socio[]>(SOCI);
  }


  getSoci(): Observable<Socio[]> {
    return this._obs;
  }

  getSocioById(id: number): Observable<Socio> {
    return this._obs.map<Socio[], Socio[]>(
      (input: Socio[]) => { return input.filter( (el: Socio) => { return el.id === id } ) }
    ).filter(
      (input) => { return input.length == 1 }
    ).map<Socio[], Socio>(
      (input: Socio[]) => { return input[0] }
    );
  }

  updateSocio(newSocio: Socio) {
    let index = SOCI.findIndex((temp: Socio) => { return temp.id == newSocio.id });
    if (index !== -1) {
      SOCI[index].reinit(newSocio);
      this._obs.next(SOCI);
    }
  }

  addSocio(newSocio: Socio) {
    let index = SOCI.findIndex((temp: Socio) => { return temp.id == newSocio.id });
    let maxId = Math.max.apply(null, SOCI.map(socio => socio.id));
    if (index == -1) {
      newSocio.id = maxId + 1;
      SOCI.push(newSocio);
      this._obs.next(SOCI);
    }
  }
}
