import { Component } from '@angular/core'

import { MatDialogRef } from '@angular/material'

import { Carriera } from '../model'

@Component({
    selector: 'create-carriera-dialog',
    templateUrl: 'createcarriera.dialog.html',
    styles: [
        `
        .to_left{
          display: block;
          float: left;
        }
        
        .to_right{
          display: block;
          float: right;
        }
        `
    ]
})
export class CreateCarrieraDialog{
    public model: Carriera = new Carriera({studente: false, professione: '', attiva: true});

    constructor(private _diagref: MatDialogRef<CreateCarrieraDialog>){

    }

    commitCarriera(form: any){
        if(!form.invalid){
            this._diagref.close(this.model);
        }
    }
}