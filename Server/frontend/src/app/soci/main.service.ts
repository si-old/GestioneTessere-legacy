import { Injectable } from '@angular/core'

import { Socio, Carriera, Tessera, CdL, Tesseramento } from '../common/all'

import { CorsiService } from '../corsi/main.service'
import { TesseramentiService } from '../tesseramenti/main.service'

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

const SOCI: Socio[] = [
  new Socio({
    id: 1, nome: 'nome', cognome: 'cognome', email: 'email', cellulare: 'cellulare',
    facebook: 'fb', carriere: [ new Carriera({ studente: true, matricola: 'matr', attiva: true}),new Carriera({ studente: true, matricola: 'matr'}), new Carriera({ studente: true, matricola: 'matr'}),new Carriera({ studente: true, matricola: 'matr'}), new Carriera({ studente: true, matricola: 'matr'}) ],
    tessere: [ new Tessera({numero: '0', anno: null})]
  }),
  new Socio({
    id: 2, nome: 'nome', cognome: 'cognome', email: 'email', cellulare: 'cellulare', facebook: 'fb',
    tessere: [ new Tessera({numero: '1', anno: null }), new Tessera({numero: '1', anno: null }), new Tessera({numero: '1', anno: null })],
    carriere: [ new Carriera({studente: false, professione: 'prof' })]
  })
]

@Injectable()
export class SociService {

  private _obs: BehaviorSubject<Socio[]>;

  constructor(private _corsisrv: CorsiService, private _tesssrv: TesseramentiService) {
    let tempTessAtt: Tesseramento;
    let tempAllTess: Tesseramento[];
    this._tesssrv.getTesseramentoAttivo().subscribe(
      (tess: Tesseramento) => { tempTessAtt = tess }
    )
    this._tesssrv.getTesseramenti().subscribe(
      (allTess: Tesseramento[]) => { tempAllTess = allTess }
    )
    _corsisrv.getCorsi().then(
      (corsi: CdL[]) => {
        let i: number = 0;
        SOCI.forEach(
          (socio: Socio) => {
            socio.carriere.forEach(
              (carriera: Carriera) => {
                  if(carriera.studente){
                  carriera.corso = corsi[i];
                  i = (i + 1) % corsi.length
                }
              }
            )
            socio.tessere.forEach(
              (tessera : Tessera, index: number) => {
                tessera.anno = (index == 0) ? tempTessAtt : tempAllTess[index % tempAllTess.length ];
              }
            )
          }
        )
      }
    )
    this._obs = new BehaviorSubject<Socio[]>(SOCI);
  }


  getSoci(): Observable<Socio[]> {
    return this._obs.asObservable();
  }

  getSocioById(id: number): Socio{
    let temp = SOCI.filter((el: Socio) => {return el.id === id});
    if(temp.length === 1){
      return temp[0];
    }else{
      return null;
    }
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
