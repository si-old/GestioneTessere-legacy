import {  Component, OnInit, OnDestroy, 
          ViewChild, ElementRef, ChangeDetectorRef
        } from '@angular/core'

import { DataSource } from '@angular/cdk/table';
import { MatSort, MatSnackBar, Sort, MatDialog } from '@angular/material'

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription'
import { Observable } from 'rxjs/Observable';

import { Corso, Carriera, } from '../model'
import { FilteredSortedDataSource } from '../common'
import { CorsiService } from './main.service'

import { TextInputDialog, ScegliCorsoDialog } from '../dialogs'


@Component({
  selector: 'corsi',
  templateUrl: './main.component.html',
  styleUrls: ['../common/style.css', '../common/mainroutes.style.css']
})
export class CorsiComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['id', 'nome', 'azioni']
  editing: boolean[] = [];
  initValues: string[] = [];

  // se c'è un solo corso non si può cancellare
  enableDelete: boolean = true;


  corsiSource: FilteredSortedDataSource<Corso>;
  corsi: Corso[];
  corsiSubscription: Subscription;

  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MatSort) sorter: MatSort;

  constructor(private _corsisrv: CorsiService,
    private snackBar: MatSnackBar,
    private changeDetector: ChangeDetectorRef,
    private dialog: MatDialog) {
  }

  ngOnInit() {
    this.corsiSubscription = this._corsisrv.getCorsi().subscribe(
      (corsi: Corso[]) => {
        this.enableDelete = corsi.length > 1;
        this.corsi = corsi;
        corsi.forEach(
          (corso) => {
            this.editing[corso.id] = false;
            this.initValues[corso.id] = corso.nome;
          }
        );
      }
    );
    let filterObs: Observable<string> = Observable.fromEvent(this.filter.nativeElement, 'keyup')
                                                  .do( (x: any) => { console.log(x) } )
                                                  .map( () => { return this.filter.nativeElement.value } );
    this.corsiSource = new FilteredSortedDataSource(this._corsisrv.getCorsi(), this.sorter.sortChange, filterObs);
  }

  ngOnDestroy(){
    this.corsiSubscription.unsubscribe();
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
    this.dialog.open(ScegliCorsoDialog, {
      data: {
        da_eliminare: corso,
        corsi: this.corsi
      }
    }).afterClosed().subscribe(
      (sostituto) => { if (sostituto) this._corsisrv.deleteCorso(corso, sostituto); }
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
