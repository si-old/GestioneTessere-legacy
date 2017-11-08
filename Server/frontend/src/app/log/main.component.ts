import { Component, OnInit, ChangeDetectorRef } from '@angular/core'

import { MatDialog, MatDialogRef, PageEvent } from '@angular/material'

import { LogEntry, LogService } from './main.service'

import { ObservableDataSource } from '../common'

@Component({
    selector: 'log-component',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css']
})
export class LogComponent implements OnInit {

    displayedColumns: string[] = ['orario', 'utente', 'livello', 'origine', 'messaggio'];
    logSource: ObservableDataSource<LogEntry>;

    constructor(public _logsrv: LogService,
        private changeDetector: ChangeDetectorRef,
        private dialog: MatDialog) {
            this._logsrv.paginate = true;
    }

    ngOnInit() {
        this.logSource = new ObservableDataSource<LogEntry>(this._logsrv.getLogEntries());
        this.changeDetector.detectChanges();
    }

    clearLog(){
        this._logsrv.clearLog();
    }

    pageChange(event: PageEvent){
        this._logsrv.index = event.pageIndex;
        this._logsrv.limit = event.pageSize;
        this._logsrv.getLogEntries();
    }
}
