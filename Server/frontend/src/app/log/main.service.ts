import { Injectable } from '@angular/core'

import { HttpClient } from '@angular/common/http'

import { HTTP_GLOBAL_OPTIONS, BACKEND_SERVER } from '../common'

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
export class LogService {

    logEntrySub: Subject<LogEntry[]> = new Subject<LogEntry[]>();

    httpObserver: Observer<LogEntry[]> = {
        next: (value: LogEntry[]) => { this.logEntrySub.next(value); },
        error: (err: any) => { this.logEntrySub.error(err) },
        complete: () => {}
    }

    constructor(private http: HttpClient) {

    }

    getLogEntries(): Observable<LogEntry[]> {
        this.http.get<LogEntry[]>(REST_ENDPOINT, HTTP_GLOBAL_OPTIONS).subscribe(this.httpObserver);
        return this.logEntrySub;
    }

    clearLog(): void {
        this.http.delete<LogEntry[]>(REST_ENDPOINT, HTTP_GLOBAL_OPTIONS).subscribe(this.httpObserver);
    }
}

