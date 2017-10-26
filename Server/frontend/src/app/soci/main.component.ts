import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core'

import { Socio } from '../model'
import { TableChangeData } from '../common'
import { SociService } from './main.service'
import { AggiuntaSocioComponent } from './aggiunta.component'
import { DettagliSocioComponent } from './dettagli.component'

import { MatSort, MatSnackBar, MatDialog, MatDialogRef, Sort, PageEvent, MatAnchor } from '@angular/material'

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
  styleUrls: ['../common/style.css', '../common/mainroutes.style.css', './main.component.css'],
})
export class SociComponent implements OnInit {

  displayedColumns = ['tessera', 'nome', 'cognome', 'email', 'carriera', 'cellulare', 'facebook', 'azioni'];
  sociSource: SociDataSource;

  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MatSort) sorter: MatSort;

  constructor(public socisrv: SociService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.socisrv.paginate = true;
    this.sociSource = new SociDataSource(this.socisrv);
    this.changeDetector.detectChanges();
    Observable.fromEvent(this.filter.nativeElement, 'keyup')
      .debounceTime(150)
      .distinctUntilChanged()
      .subscribe(() => {
        if (this.sociSource) { this.sociSource.filter = this.filter.nativeElement.value; }
      });
    this.sorter.sortChange.subscribe(
      (next: Sort) => {
        this.socisrv.orderby = (!next.active || !next.direction) ? '' : next.active;
        this.socisrv.orderasc = (next.direction == 'asc');
        this.socisrv.getSoci();
      }
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

  pageChange(event: PageEvent) {
    this.socisrv.index = event.pageIndex;
    this.socisrv.limit = event.pageSize;
    this.socisrv.getSoci();
  }

  filename: string;
  fileurl: string;

  once = false;

  @ViewChild('downloadAnchor') anchor: MatAnchor;

  downloadCsv() {
    if (!this.once) {
      this.socisrv.requestCsv().subscribe(
        (file: File) => {
          this.once = true;
          this.anchor._elementRef.nativeElement.download = file.name;
          this.anchor._elementRef.nativeElement.href = URL.createObjectURL(file);
          this.anchor._elementRef.nativeElement.click();
        }
      );
      return false;
    } else {
      this.once = false;
      return true;
    }
  }
}

class SociDataSource extends DataSource<Socio>{

  _filterChange = new BehaviorSubject<string>('');

  set filter(f: string) {
    this._filterChange.next(f);
  }

  constructor(private socisrv: SociService) {
    super();
  }

  connect(): Observable<Socio[]> {
    const displayDataChanges = [
      this._filterChange,
      this.socisrv.getSoci()
    ];
    return Observable.combineLatest(
      ...displayDataChanges,
      (filter_in: string, input: Socio[]) => {
        return { data: input, filter: filter_in }
      }).map(
      (x: TableChangeData<Socio[]>) => {
        let data = x.data.slice().filter((item: Socio) => {
          return item.contains(x.filter.toLowerCase());
        })
        return data;
      }
      );
  }

  disconnect() { }
}