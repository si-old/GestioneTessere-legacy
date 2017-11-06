import { Component, Inject } from '@angular/core'

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'

import { Tesseramento, Tessera } from '../model'

import { TesseramentiService } from '../tesseramenti/main.service'

import { PATTERN_NUMERO_TESSERA } from '../common'

@Component({
    selector: 'createtessera-dialog',
    template: `
        <p mat-dialog-title color="primary" class="centered">Nuova tessera</p>
        <ng-container *ngIf="loaded">
            <ng-container *ngIf="!error">
                <form #form="ngForm" mat-dialog-content>
                    Anno: {{tessAttivo}}<br />
                    <label for="numero">Numero:</label>
                    <mat-form-field>
                        <input  type="text" name="numero" [(ngModel)]="numero" #inputNumero="ngModel"
                                matInput required [pattern]="PATTERN_NUMERO_TESSERA" [notInArray]="tessAttivo.tessere"/>
                        <mat-error *ngIf="inputNumero.errors && inputNumero.errors.required">
                            Il campo è obbligatorio!
                        </mat-error>
                        <mat-error *ngIf="inputNumero.errors && inputNumero.errors.pattern">
                            Devi inserire un numero (anche negativo).
                        </mat-error>
                        <mat-error *ngIf="inputNumero.errors && inputNumero.errors.notInArray">
                            La tessera è già assegnata!.
                        </mat-error>
                        <mat-hint *ngIf="inputNumero.untouched || !inputNumero.value">
                            Devi inserire un numero (anche negativo).
                        </mat-hint>
                    </mat-form-field>
                    <div mat-dialog-actions style="display: block">
                        <button type="submit" mat-icon-button class="to_right" (click)="commitTessera(form)" [disabled]="form.invalid">
                            <mat-icon matTooltip="Conferma" matTooltipPosition="below">done</mat-icon>
                        </button>
                        <button type="button" mat-icon-button mat-dialog-close class="to_right" >
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
        </ng-container>
    `,
    styleUrls: ['../common/style.css']
})
export class CreateTesseraDialog {

    // fix: only import doesn't show in view, must define local variable
    private PATTERN_NUMERO_TESSERA = PATTERN_NUMERO_TESSERA;

    error: boolean;
    loaded: boolean = false;
    tessAttivo: Tesseramento;

    numero: number;

    constructor( @Inject(MAT_DIALOG_DATA) private str: string,
        private dialogRef: MatDialogRef<CreateTesseraDialog>,
        private tesseramentoSrv: TesseramentiService) {
        this.tesseramentoSrv.getTesseramentoAttivo().subscribe(
            (tessAttivo: Tesseramento) => { this.tessAttivo = tessAttivo; this.error = false; this.loaded = true },
            (err) => { this.error = true; this.loaded = true }
        )
    }

    commitTessera(form) {
        if (!form.invalid) {
            this.dialogRef.close(new Tessera({ anno: this.tessAttivo, numero: this.numero }));
        }
    }
}