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

import { CdL, Carriera, } from '../model/all'
import { TableChangeData } from '../common/all'
import { CorsiService } from './main.service'

import { TextInputDialog } from '../dialogs/textinput.dialog'
import { ConfirmDialog } from '../dialogs/confirm.dialog'


@Component({
  selector: 'corsi',
  templateUrl: './main.component.html',
  styleUrls: ['../common/style.css', '../common/mainroutes.style.css']
})
export class CorsiComponent implements OnInit {

  displayedColumns: string[] = ['id', 'nome', 'azioni']
  editing: boolean[] = [];
  initValues: string[] = [];

  corsiSource: CorsiDataSource;

  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MatSort) sorter: MatSort;

  constructor(private _corsisrv: CorsiService, 
              private snackBar: MatSnackBar,
              private changeDetector: ChangeDetectorRef,
              private dialog: MatDialog) {
    this._corsisrv.getCorsi().subscribe(
      (corsi: CdL[]) => {
        corsi.forEach(
          (element, index) => { 
            this.editing[index] = false; 
            this.initValues[index] = element.nome;
          }
        );
      }
    );
  }

  ngOnInit() {
    this.corsiSource = new CorsiDataSource(this._corsisrv);
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

  revertCorso(corso: CdL, index: number){
    corso.nome = this.initValues[index];
    this.editing[index] = false;
  } 

  addCorso(){
    this.dialog.open(TextInputDialog, {
      data : "nome"
    }).afterClosed().subscribe(
      (name) => { if (name) this._corsisrv.addCorso(name) }
    );
  }

  deleteCorso(corso: CdL){
    this.dialog.open(ConfirmDialog).afterClosed().subscribe(
      (response) => { if(response) this._corsisrv.deleteCorso(corso); }
    )
  }

  updateCorso(corso: CdL, index: number) {
    if (corso.nome) {
      this._corsisrv.updateCorso(corso);
      this.initValues[index] = corso.nome;
      this.editing[index] = false;
    } else {
      this.snackBar.open("Tutti i campi sono obbligatori", "Chiudi", {
        duration: 1500
      })
    }
  }
}


class CorsiDataSource extends DataSource<CdL>{

  _filterChange = new BehaviorSubject('');
  set filter(filter: string) { this._filterChange.next(filter); }

  _sortChange = new BehaviorSubject<Sort>({ active: '', direction: '' });
  set sort(next: Sort) { this._sortChange.next(next); }

  constructor(private corsisrv: CorsiService) {
    super();
  }

  connect(): Observable<CdL[]> {
    const displayDataChanges = [
      this._filterChange,
      this._sortChange,
      this.corsisrv.getCorsi()
    ];

    return Observable.combineLatest(
      ...displayDataChanges,
      (filter_in: string, sort_in: Sort, input: CdL[]) => {
        return { data: input, filter: filter_in, sort: sort_in }
      }).map(
      (input: TableChangeData<CdL[]>) => {
        let data = input.data.slice().filter((item: CdL) => {
          return item.contains(input.filter.toLowerCase());
        })
        if (!input.sort.active || input.sort.direction == '') {
          return data;
        } else {
          return data.sort((a, b) => {
            return a.compare(b, input.sort.active, input.sort.direction);
          });
        }

      });
  }

  disconnect() { }
}