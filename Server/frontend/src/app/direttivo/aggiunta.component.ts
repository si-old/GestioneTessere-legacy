import { Component, OnInit } from '@angular/core'

import { MatDialogRef } from '@angular/material'

import { SociService } from '../soci/main.service'
import { MembroDirettivo, Socio } from '../model/all'

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
    
    constructor(private _diagref: MatDialogRef<AggiuntaDirettivoComponent>,
        private _socisrv: SociService) {

    }

    ngOnInit() {
        this._socisrv.getSoci().first().subscribe(
            (s: Socio[]) => { this.allSoci = s }
        )
    }

    addMembro(form){
        if(!form.invalid){
            let toReturn: MembroDirettivo  = new MembroDirettivo(this.socio);
            toReturn.user = this.user;
            toReturn.password = this.password;
            this._diagref.close(toReturn);
        }
        return false;
    }
}