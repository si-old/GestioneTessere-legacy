import { Component, Inject } from '@angular/core'

import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material'

import { Tesseramento, Tessera } from '../common/all'

import { TesseramentiService } from '../tesseramenti/main.service'

@Component({
    selector: 'createtessera-dialog',
    template: `
        <p md-dialog-title color="primary" class="centered">Nuova tessera</p>
        <ng-container *ngIf="!error">
            <form #form="ngForm" md-dialog-content>
                Anno: {{activeTesseramento}}<br />
                <label for="numero">Numero:</label>
                <md-input-container>
                    <input type="text" name="numero" [(ngModel)]="numero" mdInput required />
                </md-input-container>
                <div md-dialog-actions style="display: block">
                    <button md-icon-button class="to_right" (click)="commitTessera(form)" [disabled]="form.invalid">
                        <md-icon mdTooltip="Conferma" mdTooltipPosition="below">done</md-icon>
                    </button>
                    <button md-icon-button md-dialog-close class="to_right" >
                        <md-icon mdTooltip="Annulla" mdTooltipPosition="below">close</md-icon>
                    </button>
                </div>
            </form>
        </ng-container>
        <ng-container *ngIf="error">
            <div md-dialog-content>
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

    constructor( @Inject(MD_DIALOG_DATA) private str: string,
        private dialogRef: MdDialogRef<CreateTesseraDialog>,
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