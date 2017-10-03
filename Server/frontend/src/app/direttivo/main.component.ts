import { Component, OnInit, ChangeDetectorRef } from '@angular/core'

import { DataSource } from '@angular/cdk'
import { MdDialog } from '@angular/material'

import { ConfirmDialog } from '../dialogs/confirm.dialog'
import { AggiuntaDirettivoComponent } from './aggiunta.component'

import { MembroDirettivo } from '../common/all'
import { DirettivoService } from './main.service'

import { Observable } from 'rxjs/Observable'

@Component({
  selector: 'direttivo',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css', '../common/mainroutes.style.css']
})
export class DirettivoComponent{

  direttivoColumns: string[] =  ['user', 'password', 'azioni']
  direttivoSource = null;
  editing : boolean[] = [];

  constructor(private _dirsrv: DirettivoService,
              private _changeref: ChangeDetectorRef,
              private _dialog: MdDialog){

  }

  ngOnInit(){
    let obs = this._dirsrv.getDirettivo();
    this.direttivoSource = new ObservableDataSource(obs);
    obs.subscribe(
      (x: MembroDirettivo[]) => { 
        x.forEach( (v, i) => {this.editing[i] = false})
      }
    );
    this._changeref.detectChanges();
  }

  addMembro(){
    this._dialog.open(AggiuntaDirettivoComponent).afterClosed().subscribe(
      (x) => { if(x) console.log(x); }
    )
  }

  deleteMembro(m: MembroDirettivo){
    this._dialog.open(ConfirmDialog).afterClosed().subscribe(
      (x: boolean) => { if(x) this._dirsrv.deleteMembro(m); }
    )
  }
}

class ObservableDataSource implements DataSource<MembroDirettivo>{
  
  constructor(private _obs: Observable<MembroDirettivo[]>){

  }

  connect(): Observable<MembroDirettivo[]>{
    return this._obs.do(
      (x) => {console.log('obsds');console.log(x)}
    );
  }

  disconnect(){

  }
}