import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core'

import { Socio } from '../common/all'
import { SociService } from './main.service'
import { AggiuntaSocioComponent } from './aggiunta.component'
import { DettagliSocioComponent } from './dettagli.component'

import { MdSort, MdSnackBar, MdDialog, MdDialogRef } from '@angular/material'

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DataSource } from '@angular/cdk';

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
  styleUrls: ['../common/style.css']
})
export class SociComponent implements OnInit{

  displayedColumns = ['tessera', 'nome', 'cognome', 'email', 'carriera', 'cellulare', 'facebook', 'azioni'];
  sociSource: SociDataSource;
  
  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MdSort) sorter: MdSort;
  
  constructor(private socisrv: SociService, 
              private snackBar: MdSnackBar, 
              private dialog: MdDialog,
              private changeDetector: ChangeDetectorRef){
  }

  ngOnInit(){
    this.sociSource = new SociDataSource(this.socisrv, this.sorter);
    this.changeDetector.detectChanges();
    Observable.fromEvent(this.filter.nativeElement, 'keyup')
        .debounceTime(150)
        .distinctUntilChanged()
        .subscribe(() => {
          if (!this.sociSource) { return; }
          this.sociSource.filter = this.filter.nativeElement.value;
        });
  }

  updateSocio(newSocio: Socio){
    /*let valid: boolean = true;
    valid = valid && Boolean(newSocio.nome) && Boolean(newSocio.cognome);
    valid = valid && Boolean(newSocio.email) && Boolean(newSocio.cellulare);
    valid = valid && Boolean(newSocio.facebook);
    if(newSocio.studente){
      //valid = valid && Boolean(newSocio.matricola) && Boolean(newSocio.cdl);
    }else{
      valid = valid && Boolean(newSocio.professione);
    }*/
    let valid = true;
    console.log(newSocio);
    if( valid ){
      this.socisrv.updateSocio(newSocio);
    }else{
      this.snackBar.open("Tutti i campi sono obbligatori", "Chiudi", {
        duration: 1500
      })
    }
  }

  addSocio(){
    let diagopened: MdDialogRef<AggiuntaSocioComponent> = this.dialog.open(AggiuntaSocioComponent, {
      width: "75%"
    });
    diagopened.afterClosed().subscribe(
      newSocio => { console.log(newSocio);if(newSocio){this.socisrv.addSocio(newSocio);} }
    )
  }

  editSocio(selected: Socio){
    let diagopened: MdDialogRef<DettagliSocioComponent> = this.dialog.open(DettagliSocioComponent, {
      width: "75%",
      data: { socio: selected }
    });
  }
}

class SociDataSource extends DataSource<Socio>{
    
  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }

  sociData: Socio[];
  private _sociObs: Observable<Socio[]>;

  constructor(private socisrv: SociService, private _sorter: MdSort){
    super();
    this._sociObs = this.socisrv.getSoci();
    this._sociObs.subscribe((soci) => {
      this.sociData = soci;
    })
  }
    
  connect(): Observable<Socio[]> {
    const displayDataChanges = [
      this._filterChange,
      this._sorter.mdSortChange,
      this._sociObs
    ];
    
    return Observable.merge(...displayDataChanges).map(() => {
      let data =  this.sociData.slice().filter((item: Socio) => {
        return item.contains(this.filter.toLowerCase());
      })
      if (!this._sorter.active || this._sorter.direction == '') {
        return data; 
      }else{
        return data.sort((a,b) => {
          return a.compare(b, this._sorter.active, this._sorter.direction);
        });
      }
    });
  }

  disconnect() {}  
}