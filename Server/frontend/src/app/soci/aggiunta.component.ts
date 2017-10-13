import { Component, OnInit, Inject } from '@angular/core'
import { MAT_DIALOG_DATA } from '@angular/material';

import { MatDialogRef, MatSnackBar } from '@angular/material'

import { Socio, Tessera, Carriera, CdL, Tesseramento } from '../model/all'
import { CorsiService } from '../corsi/main.service'

import { TesseramentiService } from '../tesseramenti/main.service'

@Component({
    selector: 'aggiunta-socio',
    templateUrl: './aggiunta.component.html',
    styleUrls: ['./aggiunta.component.css', '../common/style.css']
})
export class AggiuntaSocioComponent implements OnInit {

    error: boolean;
    model: Socio;
    allCdL: CdL[];

    constructor(private _corsisrv: CorsiService,
        private _tessserv: TesseramentiService,
        private _snackbar: MatSnackBar,
        private _diagref: MatDialogRef<AggiuntaSocioComponent>) {
    }

    ngOnInit() {
        this.model = new Socio({
            nome: "", cognome: "", email: "", cellulare: "", facebook: "",
            tessere: [new Tessera({ numero: '' })],
            carriere: [new Carriera({ matricola: '', studente: false })]
        });
        this._corsisrv.getCorsi().subscribe(
            (x: CdL[]) => { this.model.carriere[0].corso = x[0]; },
        )
        this._tessserv.getTesseramentoAttivo().subscribe(
            (x: Tesseramento) => {
                this.error = false;
                this.model.tessere[0].anno = x;
            },
            () => { this.error = true; }
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