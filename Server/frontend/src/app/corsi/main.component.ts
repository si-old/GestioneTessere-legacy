import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'

import { DataSource } from '@angular/cdk';
import { MdSort, MdSnackBar } from '@angular/material'

import {BehaviorSubject} from 'rxjs/BehaviorSubject';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { CdL } from '../common/all'
import { CorsiService } from './main.service'

@Component({
  selector: 'corsi',
  templateUrl: './main.component.html',
  styleUrls: ['../common/style.css']
})
export class CorsiComponent implements OnInit{

  displayedColumns: string[] = ['id', 'nome', 'azioni']

  corsiSource: CorsiDataSource;

  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MdSort) sorter: MdSort;

  constructor(private _corsisrv: CorsiService, private snackBar: MdSnackBar){

  }

  ngOnInit(){
    this.corsiSource = new CorsiDataSource(this._corsisrv, this.sorter);
    Observable.fromEvent(this.filter.nativeElement, 'keyup')
        .debounceTime(150)
        .distinctUntilChanged()
        .subscribe(() => {
          if (!this.corsiSource) { return; }
          this.corsiSource.filter = this.filter.nativeElement.value;
        });
  }

  updateCorso(corso: CdL){
    if( corso.nome ){
      this._corsisrv.updateCorso(corso);
    }else{
      corso.editing = true;
      this.snackBar.open("Tutti i campi sono obbligatori", "Chiudi", {
        duration: 1500
      })
    }
  }
}


class CorsiDataSource extends DataSource<CdL>{
  
_filterChange = new BehaviorSubject('');
get filter(): string { return this._filterChange.value; }
set filter(filter: string) { this._filterChange.next(filter); }

corsiData: CdL[];

constructor(private corsisrv: CorsiService, private _sorter: MdSort){
  super();
  this.corsisrv.getCorsi().then((corsi) => {
    this.corsiData = corsi;
  });
}
  
connect(): Observable<CdL[]> {
  const displayDataChanges = [
    this._filterChange,
    this._sorter.mdSortChange,
    Observable.fromPromise(this.corsisrv.getCorsi())
  ];
  
  return Observable.merge(...displayDataChanges).map(() => {
    let data =  this.corsiData.slice().filter((item: CdL) => {
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