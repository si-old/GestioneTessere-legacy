import { Injectable } from '@angular/core'

import { HttpClient } from '@angular/common/http'

import { MembroDirettivo, Carriera, Tessera } from '../model/all'

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';


const REST_ENDPOINT = "https://www.studentingegneria.it/socisi/backend/direttivo.php";

@Injectable()
export class DirettivoService {

    _obs = new Subject<MembroDirettivo[]>()

    constructor(private http: HttpClient) {

    }

    private updateSub(value){
        let temp : MembroDirettivo[] = [];
        value.forEach(
            (old) => {temp.push(new MembroDirettivo(old));}
        )
        this._obs.next(temp);
    }

    getDirettivo(): Observable<MembroDirettivo[]> {
        this.http.get<MembroDirettivo[]>(REST_ENDPOINT).subscribe(
            (value) => this.updateSub(value)
        )
        return this._obs;
    }

    deleteMembro(m: MembroDirettivo) {
        this.http.delete<MembroDirettivo[]>(REST_ENDPOINT + '/' + m.id_direttivo).subscribe(
            (value) => { this.updateSub(value); }
        )
    }

    addMembro(m: MembroDirettivo) {
        this.http.post<MembroDirettivo[]>(REST_ENDPOINT, m).subscribe(
            (value) => {this.updateSub(value);}
        )
    }

    changeMembro(m: MembroDirettivo) {
        this.http.post<MembroDirettivo[]>(REST_ENDPOINT, m).subscribe(
            (value) => {this.updateSub(value);}
        )
    }

}