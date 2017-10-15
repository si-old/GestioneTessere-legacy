import { Injectable } from '@angular/core'

import { Socio, Carriera, Tessera, CdL, Tesseramento } from '../model/all'

import { HttpClient } from '@angular/common/http'

import { CorsiService } from '../corsi/main.service'
import { TesseramentiService } from '../tesseramenti/main.service'

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

const REST_ENDPOINT: string = 'https://www.studentingegneria.it/socisi/backend/socio.php'

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
