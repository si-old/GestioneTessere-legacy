import { Injectable } from '@angular/core'

import { Socio, Carriera, Tessera, Corso, Tesseramento } from '../model'

import { HTTP_GLOBAL_OPTIONS, BACKEND_SERVER, OrderingPaginableService, PaginatedResults } from '../common'

import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http'

import { CorsiService } from '../corsi/main.service'
import { TesseramentiService } from '../tesseramenti/main.service'

import { Observable } from 'rxjs/Observable';
import { NextObserver, ErrorObserver } from 'rxjs/Observer'
import { Subject } from 'rxjs/Subject';

const REST_ENDPOINT: string = BACKEND_SERVER + "socio.php";

@Injectable()
export class SociService extends OrderingPaginableService {

  private _obs: Subject<Socio[]>;
  private _singleObs: Subject<Socio>;


  _tesserati: boolean = true;
  get tesserati(): boolean {
    return this._tesserati;
  }
  set tesserati(value: boolean) {
    this._tesserati = value;
    this.getSoci();
  }

  httpPaginatedObserver: NextObserver<PaginatedResults<Socio>> | ErrorObserver<PaginatedResults<Socio>> = {
    next: (value: PaginatedResults<Socio>) => {
      this.updateSub(value.results);
      this.length = value.totale;
    },
    error: (err: any) => { this._obs.error(err) },
    complete: () => { }
  }

  private httpObserver: NextObserver<Socio[]> | ErrorObserver<Socio[]> = {
    next: (value) => { this.updateSub(value); },
    error: (error) => { this._obs.error(error); }
  }

  private httpSingleObserver: NextObserver<Socio> | ErrorObserver<Socio> = {
    next: (value) => { this.updateSingleSub(value); },
    error: (error) => { this._singleObs.error(error); }
  }

  constructor(private http: HttpClient) {
    super();
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

  queryString() {
    let query_string: string = super.queryString();
    if (this.tesserati != null) {
      query_string = [super.queryString(), 'tesserati=' + this.tesserati].filter(x => x).join('&');
    }
    return query_string
  }

  getSoci(): Observable<Socio[]> {
    let obs: any;
    if (this.paginate) {
      obs = this.httpPaginatedObserver
    } else {
      obs = this.httpObserver;
    }
    this.http.get<Socio[]>(REST_ENDPOINT + '?' + this.queryString(), HTTP_GLOBAL_OPTIONS)
      .subscribe(obs)
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
    let obs: any;
    if (this.paginate) {
      obs = this.httpPaginatedObserver
    } else {
      obs = this.httpObserver;
    }
    this.http.post<Socio[]>(REST_ENDPOINT + '?' + this.queryString(), newSocio, HTTP_GLOBAL_OPTIONS).subscribe(obs)
  }


  requestCsv(): Observable<File> {
    let headers = new HttpHeaders().set('Accept', 'text/csv');
    return this.http.get(REST_ENDPOINT + '?tesserati=' + this.tesserati, {
      ...HTTP_GLOBAL_OPTIONS,
      observe: 'response',
      headers: headers,
      responseType: 'arraybuffer'
    }).map(
      (res: HttpResponse<ArrayBuffer>) => {
        let disposition = res.headers.get('Content-Disposition');
        let filename = disposition.substr(disposition.search('=')+1);
        var file = new File([res.body], filename);
        return file;
      })
  }
}
