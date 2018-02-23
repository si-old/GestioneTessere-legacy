import { Component, OnInit, ChangeDetectorRef } from '@angular/core'

import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material'

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
        private dialog: MatDialog,
        private snackBar: MatSnackBar) {

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

    ngOnDestroy() {
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
        if (t.anno) {
            if (t.anno && t.anno != this.oldValues[t.id]) {
                this._tessService.modificaTesseramento(t);
            }
            this.editing[t.id] = false;
        } else {
            this.snackBar.open("Tutti i campi sono obbligatori", "Chiudi", {
                duration: 1500
            })
        }
    }

    revertChanges(t: Tesseramento) {
        t.anno = this.oldValues[t.id];
        this.editing[t.id] = false;
    }

    showTessereAssegnate(t: Tesseramento) {
        let spazioNumero = 6;
        let dimensioneRiga = 10;

        let tesserePositiveOrdinate: number[] = t.tessere.filter((a) => { return a > 0 })
            .sort((a, b) => { return a - b });
        let maxTessera = Math.max(...tesserePositiveOrdinate);
        let parti = Array(maxTessera).fill(' '.repeat(spazioNumero));
        tesserePositiveOrdinate.forEach(
            (index) => {
                parti[index - 1] = index.toString().padStart(spazioNumero - 1, ' ') + ',';
            }
        );
        let messaggio: string = 
        Array.from({length: Math.ceil(maxTessera / dimensioneRiga) + 1}, (value, key) => key)
            .map((x, i) => parti.slice(i * dimensioneRiga, (i + 1) * dimensioneRiga))
            .map((x) => x.join(''))
            .reduce((acc, val) => acc + '\n' + val);
        this.dialog.open(MessageDialog, {
            data: {
                message: "Le tessere assegnate sono: \n" + messaggio
            }
        })
    }
}
