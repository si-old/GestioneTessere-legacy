import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

import { BlacklistMember } from '../model'

import { Observable } from 'rxjs/Observable'
import { NextObserver, ErrorObserver } from 'rxjs/Observer'
import { Subject } from 'rxjs/Subject'

const REST_ENDPOINT: string = "https://www.studentingegneria.it/socisi/backend/blacklist.php"

export class BlacklistResponse{
    allowed: BlacklistMember[];
    blacklist: BlacklistMember[];
}

@Injectable()
export class BlacklistService{

    blacklistSub: Subject<BlacklistResponse> = new Subject<BlacklistResponse>();

    private blacklistObserver: NextObserver<BlacklistResponse> | ErrorObserver<BlacklistResponse> = {
        next: (value) => { this.blacklistSub.next(value); },
        error: (error) => { this.blacklistSub.error(error); }
    }
    
    constructor(private http: HttpClient){}

    getBlacklist(): Observable<BlacklistResponse>{
        this.http.get<BlacklistResponse>(REST_ENDPOINT).subscribe(this.blacklistObserver);
        return this.blacklistSub;
    }

    private changeBlacklist(ids: number[], blacklist: boolean){
        this.http.post<BlacklistResponse>(REST_ENDPOINT, {
            id: ids,
            blacklist: blacklist
        }).subscribe(this.blacklistObserver);
    }

    addToBlacklist(ids: number[]){
        this.changeBlacklist(ids, true);
    }

    removeFromBlacklist(ids: number[]){
        this.changeBlacklist(ids, false);
    }
}