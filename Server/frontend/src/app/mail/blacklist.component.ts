import { Component, OnInit, OnDestroy } from '@angular/core'

import { MatSelectionList, MatListOption } from  '@angular/material'

import { BlacklistMember } from '../model'

import { BlacklistService, BlacklistResponse } from './blacklist.service'

import { Subscription } from 'rxjs'

@Component({
    selector: 'blacklist',
    templateUrl: './blacklist.component.html',
    styleUrls: ['./blacklist.component.css']
})
export class BlacklistComponent implements OnInit, OnDestroy{

    allowed: BlacklistMember[] = [];
    blacklist: BlacklistMember[] = [];

    subscription: Subscription;

    constructor(private blacklistsrv: BlacklistService){}

    ngOnInit(){
        this.subscription = this.blacklistsrv.getBlacklist().subscribe(
            (res: BlacklistResponse) => {
                this.allowed = res.allowed;
                this.blacklist = res.blacklist;
            }
        );
    }

    ngOnDestroy(){
        this.subscription.unsubscribe();
    }

    changeBlacklist(list: MatSelectionList, modelList: BlacklistMember[], blacklist: boolean){
        let selected_ids: number[] = [];
        list.options.forEach(
            (opt: MatListOption, index: number) => { if(opt.selected) selected_ids.push(modelList[index].id) }
        )
        this.blacklistsrv.editBlacklist(selected_ids, blacklist);
    }

}