import { Component, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialog, MatSnackBar } from '@angular/material';
import { Location } from '@angular/common'
import { ActivatedRoute, ParamMap } from '@angular/router'

import { Socio, Tessera, Carriera, Corso, Tesseramento } from '../model'
import { CorsiService } from '../corsi/main.service'

import { TesseramentiService } from '../tesseramenti/main.service'
import { SociService } from './main.service'

import { LoadingTracker } from '../ux'
import { MessageDialog, ConfirmDialog } from '../dialogs'
import { PATTERN_NUMERO_TESSERA, PATTERN_MATRICOLA, PATTERN_CELLULARE } from '../common'

import { first } from 'rxjs/operators'

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


    error: boolean | string = false;
    loading: LoadingTracker = new LoadingTracker(2);
    

    model: Socio;
    allCorsi: Corso[];

    tessAttivo: Tesseramento;

    constructor(private _corsisrv: CorsiService,
        private _tessserv: TesseramentiService,
        private _snackbar: MatSnackBar,
        private _diag: MatDialog,
        private _location: Location,
        private _activeRoute: ActivatedRoute,
        private _socisrv: SociService) {
    }

    ngOnInit() {
        this._activeRoute.paramMap.subscribe(
            (pm: ParamMap) => {
                if (pm.has("id")) {
                    this._socisrv.getSocioById(+pm.get("id")).subscribe(
                        (s: Socio) => {
                            this.model = s.clone();
                            this.loading.addStep();
                            this.createTessera();
                        }
                    )
                } else {
                    this.model = new Socio({
                        nome: "", cognome: "", email: "", cellulare: "", facebook: "",
                        tessere: [],
                        carriere: [new Carriera({ matricola: '', studente: false, corso: null })]
                    });
                    this._corsisrv.getCorsi().pipe(first()).subscribe(
                        (x: Corso[]) => {
                            this.model.carriere[0].corso = x[0];
                            this.loading.addStep();
                        },
                    )
                    this.createTessera();
                }
            }
        )
    }

    createTessera() {
        this._tessserv.getTesseramentoAttivo().subscribe(
            (x: Tesseramento) => {
                if (this.model.tessere.length > 0 && x.equals(this.model.tessere[0].anno)) {
                    this.error = "Socio già tesserato!";
                } else {
                    this.model.tessere.unshift(new Tessera({ numero: null }));
                    this.tessAttivo = x;
                    this.model.tessere[0].anno = x;
                    this.error = false;
                }
                this.loading.addStep();
            },
            (err: any) => {
                this.error = "Nessun tesseramento attivo!";
                this.loading.addStep();
                throw err;
            }
        )
    }

    submitForm(form: any) {
        if (!form.invalid) {
            this._diag.open(ConfirmDialog).afterClosed().subscribe(
                () => {
                    if(this.model.id){
                        this._socisrv.updateSocio(this.model);
                    }else{
                        this._socisrv.addSocio(this.model);
                    }
                    this._diag.open(MessageDialog, {
                        data: {
                            message: "Richiesta inviata correttamente!"
                        }
                    });
                    this._location.back();
                }
            )
        } else {
            this._snackbar.open("Tutti i campi sono obbligatori", "Ok", {
                duration: 1500
            })
        }
        return false; //to prevent Edge from reloading
    }

    revertForm(form: any) {
        this._location.back();
        return false; //to prevent Edge from reloading
    }
}