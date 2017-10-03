import { Component, OnInit } from '@angular/core'

import { MdDialogRef } from '@angular/material'

import { SociService } from '../soci/main.service'
import { MembroDirettivo, Socio } from '../common/all'

@Component({
    selector: 'aggiunta-direttivo',
    templateUrl: './aggiunta.component.html',
    styleUrls: ['./aggiunta.component.css', '../common/style.css']
})
export class AggiuntaDirettivoComponent implements OnInit {

    allSoci: Socio[];

    socio: Socio = null
    user: string;
    password: string;
    password2: string;
    
    constructor(private _diagref: MdDialogRef<AggiuntaDirettivoComponent>,
        private _socisrv: SociService) {

    }

    ngOnInit() {
        this._socisrv.getSoci().first().subscribe(
            (s: Socio[]) => { this.allSoci = s }
        )
    }

    //TODO check form e ritorno utente al direttivo
}