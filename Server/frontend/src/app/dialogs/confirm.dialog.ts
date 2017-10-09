import { Component } from '@angular/core'

import { MatDialogRef } from '@angular/material'

@Component({
    selector: 'confirm-dialog',
    template: `
        <p mat-dialog-title color="primary" class="centered">Conferma</p>
        <p mat-dialog-content class="fontstyle">Sei sicuro di voler confermare?</p>
        <div mat-dialog-actions>
            <button mat-button color="primary" (click)="dialogRef.close(false)" class="half-size">No</button>
            <button mat-button color="primary" (click)="dialogRef.close( true)" class="half-size"> Si</button>
        </div>
    `,
    styleUrls: ['../common/style.css']
})
export class ConfirmDialog{

    constructor(private dialogRef: MatDialogRef<ConfirmDialog>){

    }
}