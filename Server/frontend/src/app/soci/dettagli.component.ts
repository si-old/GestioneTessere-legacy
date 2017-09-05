import { Component, OnInit, Inject, Optional } from '@angular/core'

import { Location } from '@angular/common'

import { ActivatedRoute } from "@angular/router";
import { MD_DIALOG_DATA, MdDialogRef, MdSnackBar } from '@angular/material'

import { Socio, Tessera, Carriera, CdL } from '../common/all'

import { CorsiService } from '../corsi/main.service'
import { SociService } from './main.service'

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DataSource } from '@angular/cdk';

import { Observable } from 'rxjs/Observable';


@Component({
    selector: 'dettagli-socio',
    templateUrl: './dettagli.component.html',
    styleUrls: ['./dettagli.component.css']
})
export class DettagliSocioComponent implements OnInit {

    private in_dialog: boolean = false;
    private _diagref: MdDialogRef<DettagliSocioComponent> = null;
    private form_style: string ="in_route"
    editing: boolean = false;

    model: Socio;
    initModel: Socio;
    allCdL: CdL[];

    carriereSource: CarriereDataSource;
    carriereColumns: string[] = ['studente', 'dettagli', 'attiva'];

    tessereSource: TessereDataSource;
    tessereColumns: string[] = ['numero', 'anno'];

    constructor(private _corsisrv: CorsiService,
                private _socisrv: SociService,
                private _snack: MdSnackBar,
                private _location: Location,
                private _route: ActivatedRoute,
                @Optional() @Inject(MD_DIALOG_DATA) data: any,
                @Optional() private diagref: MdDialogRef<DettagliSocioComponent>) 
    {
        if(diagref){
            this.in_dialog = true;
            this.form_style = "in_dialog";
            this._diagref = diagref;            
        }
        if (this.in_dialog && data) {
            this.model = data.socio;
            this.initModel = Object.assign({}, this.model);            
        } else if (this.in_dialog) {
            this.model = new Socio({
                nome: "", cognome: "", email: "", cellulare: "", facebook: "",
                tessere: [new Tessera({ numero: '', anno: null })],
                carriere: [new Carriera({ studente: true, matricola: '', corso: null })]
            });
            this.initModel = Object.assign({}, this.model);            
        } else {
            _route.params.subscribe(
                (params) => {
                    this.model = this._socisrv.getSocioById(+params['id']);
                    this.initModel = Object.assign({}, this.model);                    
                }
            );
        }
        //shallow copy to avoid reference
    }

    ngOnInit() {
        this._corsisrv.getCorsi().then(
            (corsi: CdL[]) => { this.allCdL = corsi }
        )
        this.carriereSource = new CarriereDataSource(this.model);
        this.tessereSource = new TessereDataSource(this.model);
    }

    exit(){
        if(this.in_dialog){
            this._diagref.close(null);            
        }else{
            this._location.back();
        }
    }

    confirm(form: any) {
        if (!form.invalid) {
            this.editing = false;
            if (this.in_dialog) {
                this._diagref.close(this.model);
            }
        } else {
            this._snack.open("Qualche campo non è stato compilato correttamente", "OK", {
                duration: 1500
            });
        }
    }

    revert(form: any) {
        Object.assign(this.model, this.initModel);
        this.editing = false;
    }

}

class CarriereDataSource extends DataSource<Carriera>{

    carriereSub: BehaviorSubject<Carriera[]>

    constructor(private socio: Socio) {
        super();
        this.carriereSub = new BehaviorSubject<Carriera[]>(socio.carriere);
    }

    connect(): Observable<Carriera[]> {
        return this.carriereSub;
    }

    disconnect() { }
}

class TessereDataSource extends DataSource<Tessera>{

    tesseraSub: BehaviorSubject<Tessera[]>

    constructor(private socio: Socio) {
        super();
        this.tesseraSub = new BehaviorSubject<Tessera[]>(socio.tessere);
    }

    connect(): Observable<Tessera[]> {
        return this.tesseraSub;
    }

    disconnect() { }
}