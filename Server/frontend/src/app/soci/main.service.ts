import { Injectable } from '@angular/core'

import { Socio, Carriera, Tessera, Corso, Tesseramento } from '../model'

import { HTTP_GLOBAL_OPTIONS, BACKEND_SERVER } from '../common'

import { HttpClient } from '@angular/common/http'

import { CorsiService } from '../corsi/main.service'
import { TesseramentiService } from '../tesseramenti/main.service'

import { Observable } from 'rxjs/Observable';
import { NextObserver, ErrorObserver } from 'rxjs/Observer'
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

const REST_ENDPOINT: string = BACKEND_SERVER + "socio.php";

@Injectable()
export class SociService {

  private _obs: Subject<Socio[]>;
  private _singleObs: Subject<Socio>;

  private httpObserver: NextObserver<Socio[]> | ErrorObserver<Socio[]> = {
    next: (value) => { this.updateSub(value); },
    error: (error) => { this._obs.error(error); }
  }

  private httpSingleObserver: NextObserver<Socio> | ErrorObserver<Socio> = {
    next: (value) => { this.updateSingleSub(value); },
    error: (error) => { this._singleObs.error(error); }
  }

  constructor(private http: HttpClient) {
    this._obs = new Subject<Socio[]>();
    this._singleObs = new Subject<Socio>();
  }

  updateSub(value) {
    let tempArray: Socio[] = [];
    value.forEach(
      (x) => { tempArray.push(new Socio(x)); }
    );
    this._obs.next(tempArray);
  }

  updateSingleSub(value) {
    let temp: Socio = new Socio(value);
    this._singleObs.next(temp);
  }

  getSoci(tesserati ?: boolean): Observable<Socio[]> {
    let query_string: string = ''
    if (tesserati != null) {
      query_string = '?tesserati=' + tesserati
    }
    this.http.get<Socio[]>(REST_ENDPOINT + query_string, HTTP_GLOBAL_OPTIONS)
      .subscribe(this.httpObserver)
    return this._obs;
  }

  getSocioById(id: number): Observable<Socio> {
    this.http.get<Socio>(REST_ENDPOINT + '/' + id, HTTP_GLOBAL_OPTIONS).subscribe(this.httpSingleObserver)
    return this._singleObs;
  }

  updateSocio(newSocio: Socio): void {
    this.http.post<Socio>(REST_ENDPOINT + '/' + newSocio.id, newSocio, HTTP_GLOBAL_OPTIONS).subscribe(this.httpSingleObserver)
  }

  addSocio(newSocio: Socio): void {
    this.http.post<Socio[]>(REST_ENDPOINT, newSocio, HTTP_GLOBAL_OPTIONS).subscribe(this.httpObserver)
  }
}
