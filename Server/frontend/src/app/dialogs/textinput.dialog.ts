import { Component, Inject } from '@angular/core'

import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material'

@Component({
    selector: 'confirm-dialog',
    template: `
        <p md-dialog-title color="primary" class="centered">Conferma</p>
        <form>
        <div md-dialog-content class="fontstyle">
            <label>Inserisci {{str}}:</label>
            <md-input-container>
                <input type="text" mdInput name="anno" [(ngModel)]="testo" #input="ngModel" required/>
            </md-input-container>
        </div>
        <div md-dialog-actions>
            <button md-button color="primary" (click)="onSubmit(false)" class="half-size" >No</button>
            <button md-button color="primary" (click)="onSubmit(true)" class="half-size" [disabled]="input.invalid"> Si</button>
        </div>
        </form>
    `,
    styleUrls: ['../common/style.css']
})
export class TextInputDialog{

    testo: string;
    constructor(@Inject(MD_DIALOG_DATA) private str: string,
                private dialogRef: MdDialogRef<TextInputDialog>){
    }

    onSubmit(accept: boolean): boolean{
        if(accept){
            this.dialogRef.close(this.testo);
        }else{
            this.dialogRef.close();
        }
        return false; //to prevent Edge from reloading
    }
}