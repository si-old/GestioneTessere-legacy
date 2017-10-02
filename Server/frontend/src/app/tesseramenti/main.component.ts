import { Component, OnInit, ChangeDetectorRef } from '@angular/core'

import { MdDialog, MdDialogRef } from '@angular/material'

import { Tesseramento } from '../common/all'
import { TesseramentiService } from './main.service'

import { ConfirmDialog } from '../dialogs/confirm.dialog'
import { TextInputDialog } from '../dialogs/textinput.dialog'


import { Observable } from 'rxjs/Observable'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DataSource } from '@angular/cdk';

@Component({
    selector: 'tesseramenti',
    templateUrl: './main.component.html',
    styleUrls: ['../common/style.css', '../common/mainroutes.style.css']
})
export class TesseramentiComponent implements OnInit {

    displayedColumns: string[] = ['anno', 'attivo', 'azioni'];
    tessSource: TesseramentiDataSource;

    constructor(private _tessService: TesseramentiService,
        private changeDetector: ChangeDetectorRef,
        private dialog: MdDialog) {

    }

    ngOnInit() {
        this.tessSource = new TesseramentiDataSource(this._tessService);
        this.changeDetector.detectChanges();
    }

    closeCallback() {
        let diagopened: MdDialogRef<ConfirmDialog> = this.dialog.open(ConfirmDialog);
        diagopened.afterClosed().subscribe(
            response => { if (response) this._tessService.chiudiTesseramento(); }
        );
    }

    newCallback() {
        let diagopened: MdDialogRef<TextInputDialog> = this.dialog.open(TextInputDialog, {
            data: "anno"
        });
        diagopened.afterClosed().subscribe(
            anno => { if (anno) this._tessService.attivaNuovoTesseramento(anno); }
        );
    }
}
class TesseramentiDataSource extends DataSource<Tesseramento>{

    constructor(private _tessServ: TesseramentiService) {
        super();
    }

    connect(): Observable<Tesseramento[]> {
        return this._tessServ.getTesseramenti();
    }

    disconnect(): void {

    }
}

