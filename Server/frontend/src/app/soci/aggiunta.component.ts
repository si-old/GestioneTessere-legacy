import { Component, OnInit, Inject } from '@angular/core'
import { MD_DIALOG_DATA } from '@angular/material';

import { MdDialogRef, MdSnackBar } from '@angular/material'

import { Socio, Tessera, Carriera, CdL, Tesseramento } from '../common/all'
import { CorsiService } from '../corsi/main.service'

import { TesseramentiService } from '../tesseramenti/main.service'

@Component({
    selector: 'aggiunta-socio',
    templateUrl: './aggiunta.component.html',
    styleUrls: ['./aggiunta.component.css']
})
export class AggiuntaSocioComponent implements OnInit {

    loading: boolean = true;
    error: boolean = false;
    model: Socio;
    allCdL: CdL[];

    constructor(private _corsisrv: CorsiService,
        private _tessserv: TesseramentiService,
        private _snackbar: MdSnackBar,
        private _diagref: MdDialogRef<AggiuntaSocioComponent>) {
        _tessserv.getTesseramentoAttivo().subscribe(
            (tessAttivo: Tesseramento) => {
                if(tessAttivo){
                    this.model = new Socio({
                        nome: "", cognome: "", email: "", cellulare: "", facebook: "",
                        tessere: [new Tessera({ numero: '', anno: tessAttivo })],
                        carriere: [new Carriera({ studente: true, matricola: '', corso: null })]
                    });
                    this.loading = false;
                }else{
                    this.error = true;
                }
            }
        )
    }

    ngOnInit() {
        this._corsisrv.getCorsi().then(
            (corsi: CdL[]) => { this.allCdL = corsi }
        )
    }

    submitForm(form: any) {
        if (!form.invalid) {
            this._diagref.close(this.model);
        }else{
            this._snackbar.open("Tutti i campi sono obbligatori","Ok", {
                duration: 1500
            })
        }
    }

    revertForm(form: any) {
        this._diagref.close(null);
    }
}