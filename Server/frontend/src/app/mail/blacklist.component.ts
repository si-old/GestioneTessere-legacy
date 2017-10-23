import { Component, OnInit } from '@angular/core'

import { MatSelectionList, MatListOption } from  '@angular/material'

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

    changeBlacklist(list: MatSelectionList, modelList: BlacklistMember[], blacklist: boolean){
        let selected_ids: number[] = [];
        list.options.forEach(
            (opt: MatListOption, index: number) => { if(opt.selected) selected_ids.push(modelList[index].id) }
        )
        this.blacklistsrv.editBlacklist(selected_ids, blacklist);
    }

}