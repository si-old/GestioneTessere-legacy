import { Component } from '@angular/core'

import { MdDialogRef } from '@angular/material'

@Component({
    selector: 'confirm-dialog',
    template: `
        <p md-dialog-title color="primary" class="centered">Conferma</p>
        <p md-dialog-content class="fontstyle">Sei sicuto di voler confermare?</p>
        <div md-dialog-actions>
            <button md-button color="primary" (click)="dialogRef.close(false)" class="half-size">No</button>
            <button md-button color="primary" (click)="dialogRef.close( true)" class="half-size"> Si</button>
        </div>
    `,
    styles:[
        `.fontstyle{
            font-family: Roboto, "Helvetica Neue", sans-serif;
        }`,
        `
        .centered{
            text-align: center;
        }
        `,
        `.half-size{
            width: 50%
        }`
    ]
})
export class ConfirmDialogComponent{

    constructor(private dialogRef: MdDialogRef<ConfirmDialogComponent>){

    }
}