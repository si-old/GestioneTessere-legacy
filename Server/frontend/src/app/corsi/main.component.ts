import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core'

import { DataSource } from '@angular/cdk/table';
import { MatSort, MatSnackBar, Sort, MatDialog } from '@angular/material'

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { Corso, Carriera, } from '../model'
import { FilteredSortedDataSource } from '../common'
import { CorsiService } from './main.service'

import { TextInputDialog, ConfirmDialog } from '../dialogs'


@Component({
  selector: 'corsi',
  templateUrl: './main.component.html',
  styleUrls: ['../common/style.css', '../common/mainroutes.style.css']
})
export class CorsiComponent implements OnInit {

  displayedColumns: string[] = ['id', 'nome', 'azioni']
  editing: boolean[] = [];
  initValues: string[] = [];

  corsiSource: FilteredSortedDataSource<Corso>;

  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MatSort) sorter: MatSort;

  constructor(private _corsisrv: CorsiService,
    private snackBar: MatSnackBar,
    private changeDetector: ChangeDetectorRef,
    private dialog: MatDialog) {
    this._corsisrv.getCorsi().subscribe(
      (corsi: Corso[]) => {
        corsi.forEach(
          (corso) => {
            this.editing[corso.id] = false;
            this.initValues[corso.id] = corso.nome;
          }
        );
      }
    );
  }

  ngOnInit() {
    this.corsiSource = new FilteredSortedDataSource(this._corsisrv.getCorsi());
    this.changeDetector.detectChanges();
    Observable.fromEvent(this.filter.nativeElement, 'keyup')
      .debounceTime(150)
      .distinctUntilChanged()
      .subscribe(() => {
        if (!this.corsiSource) { return; }
        this.corsiSource.filter = this.filter.nativeElement.value;
      });
    this.sorter.sortChange.subscribe(
      (next: Sort) => { this.corsiSource.sort = next }
    )
  }

  revertCorso(corso: Corso) {
    corso.nome = this.initValues[corso.id];
    this.editing[corso.id] = false;
  }

  addCorso() {
    this.dialog.open(TextInputDialog, {
      data: {
        nome: "nome",
        pattern: ".*"
      }
    }).afterClosed().subscribe(
      (name) => { if (name) this._corsisrv.addCorso(name) }
      );
  }

  deleteCorso(corso: Corso) {
    this.dialog.open(ConfirmDialog).afterClosed().subscribe(
      (response) => { if (response) this._corsisrv.deleteCorso(corso); }
    )
  }

  updateCorso(corso: Corso) {
    if (corso.nome) {
      if (corso.nome != this.initValues[corso.id]) {
        this._corsisrv.updateCorso(corso);
        this.initValues[corso.id] = corso.nome;
      }
      this.editing[corso.id] = false;
    } else {
      this.snackBar.open("Tutti i campi sono obbligatori", "Chiudi", {
        duration: 1500
      })
    }
  }
}
