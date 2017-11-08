import { Component, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA } from '@angular/material';

import { MatDialogRef, MatSnackBar } from '@angular/material'

import { Socio, Tessera, Carriera, Corso, Tesseramento } from '../model'
import { CorsiService } from '../corsi/main.service'

import { TesseramentiService } from '../tesseramenti/main.service'

import { LoadingTracker } from '../ux'
import { PATTERN_NUMERO_TESSERA, PATTERN_MATRICOLA, PATTERN_CELLULARE } from '../common'

@Component({
    selector: 'aggiunta-socio',
    templateUrl: './aggiunta.component.html',
    styleUrls: ['./aggiunta.component.css', '../common/style.css']
})
export class AggiuntaSocioComponent implements OnInit {

    // fix: only import doesn't show in view, must define local variable
    private PATTERN_NUMERO_TESSERA = PATTERN_NUMERO_TESSERA;
    private PATTERN_MATRICOLA = PATTERN_MATRICOLA;
    private PATTERN_CELLULARE = PATTERN_CELLULARE;


    error: boolean = false;
    loading: LoadingTracker = new LoadingTracker(2);

    model: Socio;
    allCorsi: Corso[];

    tessAttivo: Tesseramento;

    constructor(private _corsisrv: CorsiService,
        private _tessserv: TesseramentiService,
        private _snackbar: MatSnackBar,
        private _diagref: MatDialogRef<AggiuntaSocioComponent>) {
    }

    ngOnInit() {
        this.model = new Socio({
            nome: "", cognome: "", email: "", cellulare: "", facebook: "",
            tessere: [new Tessera({ numero: null })],
            carriere: [new Carriera({ matricola: '', studente: false })]
        });
        this._corsisrv.getCorsi().first().subscribe(
            (x: Corso[]) => { 
                this.model.carriere[0].corso = x[0];
                this.loading.addStep();
            },
        )
        this._tessserv.getTesseramentoAttivo().subscribe(
            (x: Tesseramento) => {
                this.tessAttivo = x;
                this.model.tessere[0].anno = x;
                this.error = false;
                this.loading.addStep();
            },
            (err: any) => {
                this.error = true;
                this.loading.addStep();
                throw err;
            }
        )
    }

    submitForm(form: any) {
        if (!form.invalid) {
            this._diagref.close(this.model);
        } else {
            this._snackbar.open("Tutti i campi sono obbligatori", "Ok", {
                duration: 1500
            })
        }
        return false; //to prevent Edge from reloading
    }

    revertForm(form: any) {
        this._diagref.close(null);
        return false; //to prevent Edge from reloading
    }
}