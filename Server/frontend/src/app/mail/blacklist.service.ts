import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

import { BlacklistMember } from '../model'

import { Observable, NextObserver, ErrorObserver, Subject } from 'rxjs'

import { BACKEND_SERVER, HTTP_GLOBAL_OPTIONS } from '../common'

const REST_ENDPOINT: string = BACKEND_SERVER + "blacklist.php"

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
        this.http.get<BlacklistResponse>(REST_ENDPOINT, HTTP_GLOBAL_OPTIONS).subscribe(this.blacklistObserver);
        return this.blacklistSub;
    }

    editBlacklist(ids: number[], blacklist: boolean){
        this.http.post<BlacklistResponse>(REST_ENDPOINT, {
            id: ids,
            blacklist: blacklist
        }, HTTP_GLOBAL_OPTIONS).subscribe(this.blacklistObserver);
    }
}