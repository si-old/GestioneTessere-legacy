import { Injectable } from '@angular/core'

import { HttpClient } from '@angular/common/http'

import { HTTP_GLOBAL_OPTIONS, BACKEND_SERVER, PaginableService, PaginatedResults } from '../common'

import { Observable, Subject, Observer } from 'rxjs'

const REST_ENDPOINT: string = BACKEND_SERVER + 'log.php';

export class LogEntry {
    orario: string;
    origine: string;
    livello: string;
    utente: string;
    messaggio: string;
}

@Injectable()
export class LogService extends PaginableService {

    logEntrySub: Subject<LogEntry[]> = new Subject<LogEntry[]>();

    httpObserver: Observer<LogEntry[]> = {
        next: (value: LogEntry[]) => { this.logEntrySub.next(value); },
        error: (err: any) => { this.logEntrySub.error(err) },
        complete: () => { }
    }

    httpPaginatedObserver: Observer<PaginatedResults<LogEntry>> = {
        next: (value: PaginatedResults<LogEntry>) => { 
            this.logEntrySub.next(value.results); 
            this.length = value.totale;
        },
        error: (err: any) => { this.logEntrySub.error(err) },
        complete: () => { }
    }

    constructor(private http: HttpClient) {
        super();
    }

    getLogEntries(): Observable<LogEntry[]> {
        let observer: any;
        if(this.paginate){
            observer = this.httpPaginatedObserver
        }else{
            observer = this.httpObserver;
        }
        this.http.get<LogEntry[]>(REST_ENDPOINT + '?' + this.paginationQuery, HTTP_GLOBAL_OPTIONS).subscribe(observer);
        return this.logEntrySub;
    }

    clearLog(): void {
        let observer: any;
        if(this.paginate){
            observer = this.httpPaginatedObserver
        }else{
            observer = this.httpObserver;
        }
        this.http.delete<LogEntry[]>(REST_ENDPOINT + '?' + this.paginationQuery, HTTP_GLOBAL_OPTIONS).subscribe(observer);
    }
}

