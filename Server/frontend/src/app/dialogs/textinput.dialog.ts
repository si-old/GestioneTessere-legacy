import { Component, Inject } from '@angular/core'

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'

@Component({
    selector: 'confirm-dialog',
    template: `
        <p mat-dialog-title color="primary" class="centered">Conferma</p>
        <form>
        <div mat-dialog-content class="fontstyle">
            <label>Inserisci {{str}}:</label>
            <mat-input-container>
                <input  type="text" matInput name="anno" [(ngModel)]="testo" 
                        #input="ngModel" required [pattern]="pattern" />
            </mat-input-container>
        </div>
        <div mat-dialog-actions>
            <button type="button" mat-button color="primary" (click)="onSubmit(false)" class="half-size" >No</button>
            <button type="submit" mat-button color="primary" (click)="onSubmit(true)" class="half-size" [disabled]="input.invalid"> Si</button>
        </div>
        </form>
    `,
    styleUrls: ['../common/style.css']
})
export class TextInputDialog{

    testo: string;
    nome: string;
    pattern: string;

    constructor(@Inject(MAT_DIALOG_DATA) private data: {nome: string, pattern: string},
                private dialogRef: MatDialogRef<TextInputDialog>){
        if(data){
            this.nome = data.nome;
            this.pattern = data.pattern;
        }
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