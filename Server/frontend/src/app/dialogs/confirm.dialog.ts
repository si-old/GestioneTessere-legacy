import { Component } from '@angular/core'

import { MdDialogRef } from '@angular/material'

@Component({
    selector: 'confirm-dialog',
    template: `
        <p md-dialog-title color="primary" class="centered">Conferma</p>
        <p md-dialog-content class="fontstyle">Sei sicuro di voler confermare?</p>
        <div md-dialog-actions>
            <button md-button color="primary" (click)="dialogRef.close(false)" class="half-size">No</button>
            <button md-button color="primary" (click)="dialogRef.close( true)" class="half-size"> Si</button>
        </div>
    `,
    styleUrls: ['../common/style.css']
})
export class ConfirmDialog{

    constructor(private dialogRef: MdDialogRef<ConfirmDialog>){

    }
}