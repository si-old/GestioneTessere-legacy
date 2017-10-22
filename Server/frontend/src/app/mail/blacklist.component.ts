import { Component, OnInit } from '@angular/core'

import { BlacklistMember } from '../model'

import { BlacklistService, BlacklistResponse } from './blacklist.service'

@Component({
    selector: 'blacklist',
    templateUrl: './blacklist.component.html',
    styleUrls: ['./blacklist.component.css']
})
export class BlacklistComponent implements OnInit{

    allowed: BlacklistMember[] = [];
    blacklist: BlacklistMember[] = [];

    constructor(private blacklistsrv: BlacklistService){}

    ngOnInit(){
        this.blacklistsrv.getBlacklist().subscribe(
            (res: BlacklistResponse) => {
                this.allowed = res.allowed;
                this.blacklist = res.blacklist;
            }
        );
    }

}