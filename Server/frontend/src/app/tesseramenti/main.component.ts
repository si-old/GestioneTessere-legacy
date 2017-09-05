import { Component, OnInit, ChangeDetectorRef } from '@angular/core'

import { MdDialog, MdDialogRef } from '@angular/material'

import { Tesseramento } from '../common/all'
import { TesseramentiService } from './main.service'

import { ConfirmDialogComponent } from './confirm-dialog.component'
import { InputDialogComponent } from './input-dialog.component'


import { Observable } from 'rxjs/Observable'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DataSource } from '@angular/cdk';

@Component({
    selector: 'tesseramenti',
    templateUrl: './main.component.html',
    styleUrls: ['../common/style.css']
})
export class TesseramentiComponent implements OnInit{

    displayedColumns: string[]= ['anno', 'attivo', 'azioni'];
    tessSource: TesseramentiDataSource;

    constructor(private _tessService: TesseramentiService,
                private changeDetector: ChangeDetectorRef,
                private dialog: MdDialog){

    }

    ngOnInit(){
        this.tessSource = new TesseramentiDataSource(this._tessService);
        this.changeDetector.detectChanges();
    }

    closeCallback(){
        let diagopened: MdDialogRef<ConfirmDialogComponent> = this.dialog.open(ConfirmDialogComponent);
        diagopened.afterClosed().subscribe(
           response => { if(response) this._tessService.chiudiTesseramento(); }
        );
    }

    newCallback(){
        let diagopened: MdDialogRef<InputDialogComponent> = this.dialog.open(InputDialogComponent);
        diagopened.afterClosed().subscribe(
           anno => { if(anno) this._tessService.attivaNuovoTesseramento(anno); }
        );
    }
}
class TesseramentiDataSource extends DataSource<Tesseramento>{

    constructor(private _tessServ: TesseramentiService){
        super();
    }

    connect(): Observable<Tesseramento[]>{
        return this._tessServ.getTesseramenti();
    }

    disconnect():void{

    }
}

