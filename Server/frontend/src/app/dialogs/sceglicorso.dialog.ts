import { Component, Inject } from '@angular/core'

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'

import { Corso } from '../model'

@Component({
    selector: 'scegli-corso-dialog',
    templateUrl: 'sceglicorso.dialog.html',
    styleUrls: ['../common/style.css']
})
export class ScegliCorsoDialog {

    corsi: Corso[];
    da_eliminare: Corso;
    sostituto: Corso;

    constructor(private _diagref: MatDialogRef<ScegliCorsoDialog>,
        @Inject(MAT_DIALOG_DATA) private data: any) {
        this.da_eliminare = data.da_eliminare;
        this.corsi = data.corsi.filter((x: Corso) => { return x.id != data.da_eliminare.id });
        this.sostituto = this.corsi[0];
    }

    conferma(form: any) {
        if(form.valid){
            this._diagref.close(this.sostituto);
        }
    }

    annulla(){
        this._diagref.close(null);
    }
}