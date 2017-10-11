import { Component, Inject } from '@angular/core'

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'

import { Tesseramento, Tessera } from '../model/all'

import { TesseramentiService } from '../tesseramenti/main.service'

@Component({
    selector: 'createtessera-dialog',
    template: `
        <p mat-dialog-title color="primary" class="centered">Nuova tessera</p>
        <ng-container *ngIf="!error">
            <form #form="ngForm" mat-dialog-content>
                Anno: {{activeTesseramento}}<br />
                <label for="numero">Numero:</label>
                <mat-input-container>
                    <input type="text" name="numero" [(ngModel)]="numero" matInput required />
                </mat-input-container>
                <div mat-dialog-actions style="display: block">
                    <button mat-icon-button class="to_right" (click)="commitTessera(form)" [disabled]="form.invalid">
                        <mat-icon matTooltip="Conferma" matTooltipPosition="below">done</mat-icon>
                    </button>
                    <button mat-icon-button mat-dialog-close class="to_right" >
                        <mat-icon matTooltip="Annulla" matTooltipPosition="below">close</mat-icon>
                    </button>
                </div>
            </form>
        </ng-container>
        <ng-container *ngIf="error">
            <div mat-dialog-content>
                <h3>Nessun tesseramento attivo!</h3>
            </div>
        </ng-container>
    `,
    styleUrls: ['../common/style.css']
})
export class CreateTesseraDialog {

    error: boolean;
    activeTesseramento: Tesseramento;

    numero: string;

    constructor( @Inject(MAT_DIALOG_DATA) private str: string,
        private dialogRef: MatDialogRef<CreateTesseraDialog>,
        private tesseramentoSrv: TesseramentiService) {
        this.tesseramentoSrv.getTesseramentoAttivo().subscribe(
            (tessAttivo: Tesseramento) => { this.activeTesseramento = tessAttivo; this.error = false; },
            (err) => { this.error = true; }
        )
    }

    commitTessera(form) {
        if (!form.invalid) {
            this.dialogRef.close(new Tessera({ anno: this.activeTesseramento, numero: this.numero }));
        }
    }
}