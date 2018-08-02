import { Injectable } from '@angular/core'

import { HttpClient } from '@angular/common/http'

import { MembroDirettivo, Carriera, Tessera } from '../model'

import { HTTP_GLOBAL_OPTIONS, BACKEND_SERVER } from '../common'

import { Observable, NextObserver, ErrorObserver, Subject } from 'rxjs';


const REST_ENDPOINT: string = BACKEND_SERVER + "direttivo.php";

@Injectable()
export class DirettivoService {

    private _obs = new Subject<MembroDirettivo[]>()

    constructor(private http: HttpClient) {

    }

    private updateSub(value) {
        let temp: MembroDirettivo[] = [];
        value.forEach(
            (old) => { temp.push(new MembroDirettivo(old)); }
        )
        this._obs.next(temp);
    }

    private httpObserver: NextObserver<MembroDirettivo[]> | ErrorObserver<MembroDirettivo[]> = {
        next: (value) => { this.updateSub(value); },
        error: (error) => { this._obs.error(error); }
    }

    getDirettivo(): Observable<MembroDirettivo[]> {
        this.http.get<MembroDirettivo[]>(REST_ENDPOINT, HTTP_GLOBAL_OPTIONS).subscribe(this.httpObserver);
        return this._obs;
    }

    deleteMembro(m: MembroDirettivo) {
        this.http.delete<MembroDirettivo[]>(REST_ENDPOINT + '/' + m.id_direttivo, HTTP_GLOBAL_OPTIONS).subscribe(this.httpObserver);
    }

    addMembro(m: MembroDirettivo) {
        this.http.post<MembroDirettivo[]>(REST_ENDPOINT, m, HTTP_GLOBAL_OPTIONS).subscribe(this.httpObserver);
    }

    changeMembro(m: MembroDirettivo) {
        this.http.post<MembroDirettivo[]>(REST_ENDPOINT, m, HTTP_GLOBAL_OPTIONS).subscribe(this.httpObserver);
    }

}