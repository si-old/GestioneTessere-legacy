import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { Socio } from '../common/socio'
import { SociService } from './service'
import { AggiuntaSocioComponent } from './aggiunta.component'

import { DataSource } from '@angular/cdk';
import { MdSort, MdSnackBar, MdDialog, MdDialogRef } from '@angular/material'

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  selector: 'soci',
  templateUrl: './template.html',
  styleUrls: ['../common/style.css']
})
export class SociComponent implements OnInit{
  prova_flag = true;
  prova_content = "ciao";

  displayedColumns = ['id', 'nome', 'cognome', 'email', 'studente', 'matricola', 'cdl', 
                      'professione', 'cellulare', 'facebook', 'azioni'];
  sociSource: SociDataSource;
  
  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MdSort) sorter: MdSort;
  
  constructor(private socisrv: SociService, private snackBar: MdSnackBar, private dialog: MdDialog){
  }

  ngOnInit(){
    this.sociSource = new SociDataSource(this.socisrv, this.sorter);
    Observable.fromEvent(this.filter.nativeElement, 'keyup')
        .debounceTime(150)
        .distinctUntilChanged()
        .subscribe(() => {
          if (!this.sociSource) { return; }
          this.sociSource.filter = this.filter.nativeElement.value;
        });
  }

  updateSocio(newSocio: Socio){
    let valid: boolean = true;
    valid = valid && Boolean(newSocio.nome) && Boolean(newSocio.cognome);
    valid = valid && Boolean(newSocio.email) && Boolean(newSocio.cellulare);
    valid = valid && Boolean(newSocio.facebook);
    if(newSocio.studente){
      valid = valid && Boolean(newSocio.matricola) && Boolean(newSocio.cdl);
    }else{
      valid = valid && Boolean(newSocio.professione);
    }
    if( valid ){
      console.log(newSocio);      
      this.socisrv.updateSocio(newSocio);
    }else{
      newSocio.editing = true;
      this.snackBar.open("Tutti i campi sono obbligatori", "Chiudi", {
        duration: 1500
      })
    }
  }

  addSocio(){
    let diagopened: MdDialogRef<AggiuntaSocioComponent> = this.dialog.open(AggiuntaSocioComponent, {
      width: "50%"
    });
    diagopened.afterClosed().subscribe(
      newSocio => { this.socisrv.addSocio(newSocio); }
    )
  }

}

class SociDataSource extends DataSource<Socio>{
    
  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }

  sociData: Socio[];
  
  constructor(private socisrv: SociService, private _sorter: MdSort){
    super();
    this.socisrv.getSoci().subscribe((soci) => {
      this.sociData = soci;
    });
  }
    
  connect(): Observable<Socio[]> {
    const displayDataChanges = [
      this._filterChange,
      this._sorter.mdSortChange,
      this.socisrv.getSoci()
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