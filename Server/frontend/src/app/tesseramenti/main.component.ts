import { Component, OnInit, ChangeDetectorRef } from '@angular/core'

import { MatDialog, MatDialogRef } from '@angular/material'

import { Tesseramento } from '../model/all'
import { TesseramentiService } from './main.service'

import { ConfirmDialog } from '../dialogs/confirm.dialog'
import { TextInputDialog } from '../dialogs/textinput.dialog'

import { PATTERN_ANNO_TESSERAMENTO } from '../common/patterns'

import { Observable } from 'rxjs/Observable'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DataSource } from '@angular/cdk/table';

@Component({
    selector: 'tesseramenti',
    templateUrl: './main.component.html',
    styleUrls: ['../common/style.css', '../common/mainroutes.style.css']
})
export class TesseramentiComponent implements OnInit {

    displayedColumns: string[] = ['anno', 'aperto', 'azioni'];
    tessSource: TesseramentiDataSource;

    constructor(private _tessService: TesseramentiService,
        private changeDetector: ChangeDetectorRef,
        private dialog: MatDialog) {

    }

    ngOnInit() {
        this.tessSource = new TesseramentiDataSource(this._tessService);
        this.changeDetector.detectChanges();
    }

    closeCallback() {
        let diagopened: MatDialogRef<ConfirmDialog> = this.dialog.open(ConfirmDialog);
        diagopened.afterClosed().subscribe(
            response => { if (response) this._tessService.chiudiTesseramento(); }
        );
    }

    newCallback() {
        let diagopened: MatDialogRef<TextInputDialog> = this.dialog.open(TextInputDialog, {
            data: {
                nome: "anno",
                pattern: PATTERN_ANNO_TESSERAMENTO
            }
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

