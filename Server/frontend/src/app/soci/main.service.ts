import { Injectable } from '@angular/core'

import { Socio, Carriera, Tessera, CdL, Tesseramento } from '../model/all'

import { HttpClient } from '@angular/common/http'

import { CorsiService } from '../corsi/main.service'
import { TesseramentiService } from '../tesseramenti/main.service'

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

const REST_ENDPOINT: string = 'https://www.studentingegneria.it/socisi/backend/socio.php'

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

  private _obs: Subject<Socio[]>;
  private _singleObs: Subject<Socio>;

  constructor(private http: HttpClient) {
    this._obs = new Subject<Socio[]>();
    this._singleObs = new Subject<Socio>();
  }

  updateObs(value){
    let tempArray: Socio[] = [];
    value.forEach(
      (x) => { tempArray.push(new Socio(x)); }
    );
    this._obs.next(tempArray);
  }

  updateSingleObs(value){
    let temp: Socio = new Socio(value);
    this._singleObs.next(temp);
  }

  getSoci(): Observable<Socio[]> {
    this.http.get<Socio[]>(REST_ENDPOINT).subscribe(
      (value) => { this.updateObs(value); }
    )
    return this._obs;
  }

  getSocioById(id: number): Observable<Socio> {
    this.http.get<Socio>(REST_ENDPOINT + '/' + id).subscribe(
      (value) => { this.updateSingleObs(value); }
    )
    return this._singleObs;
  }

  updateSocio(newSocio: Socio) {
    this.http.post<Socio>(REST_ENDPOINT + '/' + newSocio.id, newSocio).subscribe(
      (value) => { this.updateSingleObs(value); }
    )
  }

  addSocio(newSocio: Socio) {
    this.http.post<Socio[]>(REST_ENDPOINT, newSocio).subscribe(
      (value) => { this.updateObs(value); }
    )
  }
}
