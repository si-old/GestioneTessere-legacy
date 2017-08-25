import { Component, OnInit } from '@angular/core'

import { MdDialogRef } from '@angular/material'

import { Socio } from '../common/socio'

import { CdL } from '../common/CdL'
import { CorsiService } from '../corsi/service'


@Component({
    selector: 'aggiunta-socio',
    templateUrl: './aggiunta.component.html',
    styleUrls: ['./aggiunta.component.css']
})
export class AggiuntaSocioComponent implements OnInit{

    model: Socio = new Socio({
        nome: "", cognome: "", email: "", cellulare: "", facebook: "",
        studente: true
    });
    allCdL: CdL[];

    constructor(private _corsisrv: CorsiService, private _diagref: MdDialogRef<AggiuntaSocioComponent>){

    }

    ngOnInit(){
        this._corsisrv.getCorsi().then(
            (corsi: CdL[]) => { this.allCdL = corsi }
        )
    }

    afterSubmit(form: any){
        if(!form.invalid){
            this._diagref.close(this.model);
        }
    }

}