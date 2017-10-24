import { Component, OnInit, ChangeDetectorRef, DoCheck } from '@angular/core'

import { MatDialog, MatDialogRef } from '@angular/material'

import { LogEntry, LogService } from './main.service'

import { ConfirmDialog } from '../dialogs'

import { ObservableDataSource } from '../common'

@Component({
    selector: 'log-component',
    templateUrl: './main.component.html',
    styleUrls: ['../common/style.css', '../common/mainroutes.style.css']
})
export class LogComponent implements OnInit, DoCheck {

    displayedColumns: string[] = ['orario', 'utente', 'livello', 'origine', 'messaggio'];
    logSource: ObservableDataSource<LogEntry>;

    constructor(private _logsrv: LogService,
        private changeDetector: ChangeDetectorRef,
        private dialog: MatDialog) {

    }

    ngOnInit() {
        this.logSource = new ObservableDataSource<LogEntry>(this._logsrv.getLogEntries());
        this.changeDetector.detectChanges();
    }

    ngDoCheck(){
        this.changeDetector.detectChanges();
    }
}
