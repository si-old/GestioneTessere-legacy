import { Component } from '@angular/core'

import { MdDialogRef } from '@angular/material'

@Component({
    selector: 'confirm-dialog',
    template: `
        <p md-dialog-title color="primary" class="centered">Conferma</p>
        <form>
        <div md-dialog-content class="fontstyle">
            <label>Inserisci l'anno:</label>
            <md-input-container>
                <input type="text" mdInput name="anno" [(ngModel)]="testo" #input="ngModel" required/>
            </md-input-container>
        </div>
        <div md-dialog-actions>
            <button md-button color="primary" (click)="dialogRef.close()" class="half-size" >No</button>
            <button type="submit" md-button color="primary" (click)="dialogRef.close(testo)" class="half-size" [disabled]="input.invalid"> Si</button>
        </div>
        </form>
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
export class InputDialogComponent{

    testo: string;

    constructor(private dialogRef: MdDialogRef<InputDialogComponent>){

    }
}