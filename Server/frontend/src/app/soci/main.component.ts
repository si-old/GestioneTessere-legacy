import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core'

import { Socio } from '../model/all'
import { TableChangeData } from '../common/all'
import { SociService } from './main.service'
import { AggiuntaSocioComponent } from './aggiunta.component'
import { DettagliSocioComponent } from './dettagli.component'

import { MatSort, MatSnackBar, MatDialog, MatDialogRef, Sort } from '@angular/material'

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DataSource } from '@angular/cdk/table';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  selector: 'soci',
  templateUrl: './main.component.html',
  styleUrls: ['../common/style.css','../common/mainroutes.style.css', './main.component.css'],
})
export class SociComponent implements OnInit {

  displayedColumns = ['tessera', 'nome', 'cognome', 'email', 'carriera', 'cellulare', 'facebook', 'azioni'];
  sociSource: SociDataSource;

  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MatSort) sorter: MatSort;

  constructor(private socisrv: SociService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.sociSource = new SociDataSource(this.socisrv);
    this.changeDetector.detectChanges();
    Observable.fromEvent(this.filter.nativeElement, 'keyup')
      .debounceTime(150)
      .distinctUntilChanged()
      .subscribe(() => {
        if (this.sociSource) { this.sociSource.filter = this.filter.nativeElement.value; }
      });
    this.sorter.sortChange.subscribe(
      (next: Sort) => { this.sociSource.sort = next }
    )
  }

  addSocio() {
    let diagopened: MatDialogRef<AggiuntaSocioComponent> = this.dialog.open(AggiuntaSocioComponent, {
      width: "75%"
    });
    diagopened.afterClosed().subscribe(
      newSocio => { if (newSocio) { this.socisrv.addSocio(newSocio); } }
    )
  }

  editSocio(selected: Socio) {
    let diagopened: MatDialogRef<DettagliSocioComponent> = this.dialog.open(DettagliSocioComponent, {
      width: "75%",
      data: { socio: selected }
    });
  }
}

class SociDataSource extends DataSource<Socio>{

  _filterChange = new BehaviorSubject<string>('');

  set filter(f: string) {
    this._filterChange.next(f);
  }

  //needed to give a default value to let the flow work
  _sortChange = new BehaviorSubject<Sort>({ active: '', direction: '' })

  set sort(next: Sort) {
    this._sortChange.next(next); //aliased observable to assure a first emission. sortChange doesn't do that
  }

  constructor(private socisrv: SociService) {
    super();
  }

  connect(): Observable<Socio[]> {
    const displayDataChanges = [
      this._filterChange,
      this._sortChange,
      this.socisrv.getSoci()
    ];
    return Observable.combineLatest(
      ...displayDataChanges,
      (filter_in: string, sort_in: Sort, input: Socio[]) => {
        return { data: input, filter: filter_in, sort: sort_in }
      }).map(
      (x: TableChangeData<Socio[]>) => {
        let data = x.data.slice().filter((item: Socio) => {
          return item.contains(x.filter.toLowerCase());
        })
        if (!x.sort.active || x.sort.direction == '') {
          return data;
        } else {
          return data.sort(
            (a, b) => { return a.compare(b, x.sort.active, x.sort.direction) }
          );
        }
      }
      );
  }

  disconnect() { }
}
