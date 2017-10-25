import { Component, OnInit, Inject, Optional } from '@angular/core'

import { Location } from '@angular/common'

import { ActivatedRoute, Router } from "@angular/router";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material'

import { Socio, Tessera, Carriera, Corso } from '../model'

import { PATTERN_NUMERO_TESSERA, PATTERN_CELLULARE, PATTERN_MATRICOLA, SubjectDataSource } from '../common'


import { CorsiService } from '../corsi/main.service'
import { SociService } from './main.service'
import { TesseramentiService } from '../tesseramenti/main.service'

import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DataSource } from '@angular/cdk/table';

import { Observable } from 'rxjs/Observable';

import { BoolVieweditConfig, DisplayOptions } from '../viewedit/bool.component'

import { CreateCarrieraDialog, CreateTesseraDialog, MessageDialog } from '../dialogs'


@Component({
    selector: 'dettagli-socio',
    templateUrl: './dettagli.component.html',
    styleUrls: ['./dettagli.component.css', '../common/style.css']
})
export class DettagliSocioComponent implements OnInit {

    // fix: only import doesn't show in view, must define local variable
    private PATTERN_NUMERO_TESSERA = PATTERN_NUMERO_TESSERA;
    private PATTERN_CELLULARE = PATTERN_CELLULARE;
    private PATTERN_MATRICOLA = PATTERN_MATRICOLA;

    public loaded = false;
    //related to having this component in a MatDialog or as a main component or a Route
    private in_dialog: boolean = false; // true is it is in a dialog
    private form_style: string = "in_route" //style for the form, to assure a good visualization

    //model and editing data
    editing: boolean = false; // true if you are editing data, false if you are just reading
    model: Socio; //working model, where changes happen
    id: number; //id of the requested Socio
    hasTessera: boolean = false; // true se ha una tessera dell'ultimo tesseramento, quello attivo
    initialSocio: Socio;

    //properties for carriere table
    carriereSource: SubjectDataSource<Carriera> = new SubjectDataSource<Carriera>();
    carriereColumns: string[] = ['studente', 'dettagli']; // showed columns
    carriereEditing = {}; // map to enable editing of a single row

    //properties for tessere table
    tessereSource: SubjectDataSource<Tessera> = new SubjectDataSource<Tessera>();
    tessereColumns: string[] = ['numero', 'anno'];  // showed columns
    tessereEditing = {}; // map to enable editing of a single row



    constructor(
        private _socisrv: SociService,
        private _tesssrv: TesseramentiService,
        private _location: Location,
        private _route: ActivatedRoute,
        private _router: Router,
        private _dialog: MatDialog,
        @Optional() @Inject(MAT_DIALOG_DATA) private data: any,
        @Optional() private diagref: MatDialogRef<DettagliSocioComponent>
    ) {
        if (this.diagref) { //if injected reference is not null, we are in a dialog
            this.in_dialog = true;
            this.form_style = "in_dialog";
        }
        if (this.in_dialog && this.data) { //if we are in a dialog and data have been given to us, use them
            this._socisrv.getSocioById(this.data.socio.id).subscribe(
                socio => { this.initData(socio); },
                (x) => {
                    if (x.status && x.status == 404) {
                        this.diagref.close();
                        this._dialog.open(MessageDialog, {
                            data: {
                                message: "Nessun socio trovato con questo ID!"
                            }
                        })
                    } else {
                        throw x;
                    }
                }
            );
        } else {
            this._route.params.subscribe(
                (params) => {
                    this.id = +params['id'];
                    this._socisrv.getSocioById(+params['id']).subscribe(
                        socio => { this.initData(socio); },
                        (x) => {
                            if (x.status && x.status == 404) {
                                this._router.navigate(['/soci'])
                                this._dialog.open(MessageDialog, {
                                    data: {
                                        message: "Nessun socio trovato con questo ID!"
                                    }
                                })
                            }else{
                                throw x;
                            }
                        }
                    );
                }
            );
        }
    }

    /**
     * Used to initialize the data given the socio
     * @param socio the socio to use for the model
     */

    private initData(socio: Socio): void {
        this.initialSocio = socio.clone();
        this.loaded = true;
        this.model = socio;
        this.model.carriere.forEach(
            //init single row editing in the map
            (carr: Carriera) => { this.carriereEditing[carr.id] = false; }
        );
        this.model.tessere.forEach(
            (tess: Tessera) => {
                this.tessereEditing[tess.id] = false;
                this._tesssrv.getTesseramentoAttivo().subscribe(
                    (tessAttivo) => { if (tess.anno.equals(tessAttivo)) this.hasTessera = true; },
                    () => { }
                )
            }
        );
        this.carriereSource.update(this.model.carriere);
        this.tessereSource.update(this.model.tessere);
    }

    private refreshData(socio: Socio): void {
        this.model = socio;
        this.carriereSource.update(this.model.carriere);
        this.tessereSource.update(this.model.tessere);
    }

    ngOnInit() {
    }
    /**
     * 
     */
    enableEditing() {
        this.editing = true;
        this.carriereColumns.push('azioni');
        this.tessereColumns.push('azioni');
    }

    disableEditing() {
        Object.keys(this.carriereEditing).forEach(
            (prop: string) => { this.carriereEditing[prop] = false; }
        );
        Object.keys(this.tessereEditing).forEach(
            (prop: string) => { this.tessereEditing[prop] = false; }
        );
        this.editing = false;
        this.carriereColumns.pop();
        this.tessereColumns.pop();
    }

    /**
     * Used to close the dialog, or to go back at the previous route depending on how the component is displayed
     */
    exit() {
        if (this.in_dialog) {
            this.diagref.close(null);
        } else {
            this._location.back();
        }
    }

    /**
     * Used to confirm the editing of the data
     * @param form the form submitted
     */
    confirm(form: any) {
        if (!form.invalid) {
            this.disableEditing();
            this._socisrv.updateSocio(this.model);
        }
        return false; //to prevent Edge from reloading
    }

    /**
     * USed to revert the editing of the data
     * @param form the form to revert
     */
    revert(form: any) {
        this.model.reinit(this.initialSocio);
        this.disableEditing();
        return false; //to prevent Edge from reloading
    }

    addCarriera() {
        this._dialog.open(CreateCarrieraDialog).afterClosed().subscribe(
            (new_carriera: Carriera) => {
                if (new_carriera) {
                    this.model.carriere.forEach(
                        (carriera) => (carriera.attiva = false)
                    )
                    this.model.carriere.unshift(new_carriera);
                    this.carriereSource.update(this.model.carriere);
                }
            }
        )
    }

    deleteCarriera(ind: number) {
        this.model.carriere.splice(ind, 1);
        this.carriereSource.update(this.model.carriere);
    }

    addTessera() {
        this._dialog.open(CreateTesseraDialog).afterClosed().subscribe(
            (new_tessera: Tessera) => {
                if (new_tessera) {
                    this.model.tessere.unshift(new_tessera);
                    this.tessereSource.update(this.model.tessere);
                }
            }
        )
    }

}

