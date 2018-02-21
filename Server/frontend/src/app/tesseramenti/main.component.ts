import { Component, OnInit, ChangeDetectorRef } from '@angular/core'

import { MatDialog, MatDialogRef } from '@angular/material'

import { Tesseramento } from '../model'
import { TesseramentiService } from './main.service'

import { ConfirmDialog, TextInputDialog, MessageDialog } from '../dialogs'

import { PATTERN_ANNO_TESSERAMENTO, ObservableDataSource } from '../common'

import { Subscription } from 'rxjs/Subscription'

@Component({
    selector: 'tesseramenti',
    templateUrl: './main.component.html',
    styleUrls: ['../common/style.css', '../common/mainroutes.style.css']
})
export class TesseramentiComponent implements OnInit {

    displayedColumns: string[] = ['anno', 'aperto', 'azioni'];
    tessSource: ObservableDataSource<Tesseramento>;
    tessSubscription: Subscription;

    editing: boolean[] = [];
    oldValues: string[] = [];

    constructor(private _tessService: TesseramentiService,
        private changeDetector: ChangeDetectorRef,
        private dialog: MatDialog) {

    }

    ngOnInit() {
        let obs = this._tessService.getTesseramenti();
        this.tessSource = new ObservableDataSource<Tesseramento>(obs);
        this.tessSubscription = obs.subscribe(
            (values: Tesseramento[]) => {
                values.forEach(
                    (value: Tesseramento) => {
                        this.editing[value.id] = false
                        this.oldValues[value.id] = value.anno;
                    }
                )
            }
        )
        this.changeDetector.detectChanges();
    }

    ngOnDestroy(){
        this.tessSubscription.unsubscribe();
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

    commitChanges(t: Tesseramento) {
        if (t.anno && t.anno != this.oldValues[t.id]) {
            this._tessService.modificaTesseramento(t);
        }
        this.editing[t.id] = false;
    }

    revertChanges(t: Tesseramento) {
        t.anno = this.oldValues[t.id];
        this.editing[t.id] = false;
    }

    tessereCallback(t: Tesseramento){
        this.dialog.open(MessageDialog, {
            data: {
                message: "Le tessere assegnate sono: "+ t.tessere
                                                        .sort((a,b) => {return a - b})
                                                        .join(', ')
            }
        })
    }
}
