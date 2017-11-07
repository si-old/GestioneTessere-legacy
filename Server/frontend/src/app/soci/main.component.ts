import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core'
import { ObservableMedia, MediaChange, MatchMedia } from '@angular/flex-layout'

import { Socio } from '../model'
import { FilteredSortedDataSource } from '../common'
import { SociService } from './main.service'
import { AggiuntaSocioComponent } from './aggiunta.component'
import { DettagliSocioComponent } from './dettagli.component'

import { MatSort, MatSnackBar, MatDialog, MatDialogRef, Sort, PageEvent, MatAnchor } from '@angular/material'

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'soci',
  templateUrl: './main.component.html',
  styleUrls: ['../common/style.css', '../common/mainroutes.style.css', './main.component.css'],
})
export class SociComponent implements OnInit, OnDestroy {

  displayedColumns = [];
  sociSource: FilteredSortedDataSource<Socio>;
  mediaSubscription: Subscription;

  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MatSort) sorter: MatSort;

  filename: string;
  fileurl: string;
  once = false;

  @ViewChild('downloadAnchor') anchor: MatAnchor;

  constructor(public socisrv: SociService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private changeDetector: ChangeDetectorRef,
    private media: ObservableMedia) {
  }

  updateColumns() {
    if (this.media.isActive('lt-sm')) {
      this.displayedColumns = ['tessera', 'nome', 'cognome', 'cellulare', 'azioni'];
    } else if (this.media.isActive('lt-md')) {
      this.displayedColumns = ['tessera', 'nome', 'cognome', 'email', 'cellulare', 'azioni'];
    } else {
      this.displayedColumns = ['tessera', 'nome', 'cognome', 'email', 'carriera', 'cellulare', 'facebook', 'azioni'];
    }
  }

  ngOnInit() {
    this.socisrv.paginate = true;
    let filterObs = Observable.fromEvent(this.filter.nativeElement, 'keyup')
      .map(() => this.filter.nativeElement.value)
    this.sociSource = new FilteredSortedDataSource(this.socisrv.getSoci(), this.sorter.sortChange, filterObs)
    this.changeDetector.detectChanges();
    this.updateColumns();
    this.mediaSubscription = this.media.asObservable().subscribe(() => { this.updateColumns(); });
  }

  ngOnDestroy() {
    this.mediaSubscription.unsubscribe();
  }

  addSocio() {
    let diagopened: MatDialogRef<AggiuntaSocioComponent> = this.dialog.open(AggiuntaSocioComponent, {
      width: "80vw"
    });
    diagopened.afterClosed().subscribe(
      newSocio => { if (newSocio) { this.socisrv.addSocio(newSocio); } }
    )
  }

  editSocio(selected: Socio) {
    let diagopened: MatDialogRef<DettagliSocioComponent> = this.dialog.open(DettagliSocioComponent, {
      width: "80vw",
      data: { socio: selected }
    });
  }

  pageChange(event: PageEvent) {
    this.socisrv.index = event.pageIndex;
    this.socisrv.limit = event.pageSize;
    this.socisrv.getSoci();
  }

  togglePagination() {
    this.socisrv.paginate = !this.socisrv.paginate;
    this.socisrv.getSoci();
  }

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