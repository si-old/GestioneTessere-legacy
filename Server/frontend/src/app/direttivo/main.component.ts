import { Component, OnInit, ChangeDetectorRef } from '@angular/core'

import { DataSource } from '@angular/cdk/table'
import { MatDialog } from '@angular/material'

import { ConfirmDialog } from '../dialogs/confirm.dialog'
import { AggiuntaDirettivoComponent } from './aggiunta.component'

import { MembroDirettivo } from '../model/all'
import { DirettivoService } from './main.service'

import { Observable } from 'rxjs/Observable'

@Component({
  selector: 'direttivo',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css', '../common/mainroutes.style.css']
})
export class DirettivoComponent {

  direttivoColumns: string[] = ['user', 'password', 'azioni']
  direttivoSource = null;
  editing: boolean[] = [];

  initValuesUser: string[] = [];
  initValuesPass: string[] = [];

  constructor(private _dirsrv: DirettivoService,
    private _changeref: ChangeDetectorRef,
    private _dialog: MatDialog) {

  }

  ngOnInit() {
    let obs = this._dirsrv.getDirettivo();
    this.direttivoSource = new ObservableDataSource(obs);
    obs.subscribe(
      (x: MembroDirettivo[]) => {
        console.log("received new direttivo");
        x.forEach((v, i) => {
          this.editing[i] = false
          this.initValuesUser[i] = v.user;
          this.initValuesPass[i] = v.password;
        })
      }
    );
    this._changeref.detectChanges();
  }

  addMembro() {
    this._dialog.open(AggiuntaDirettivoComponent, { width: "40%" }).afterClosed().subscribe(
      (x) => { if (x) this._dirsrv.addMembro(x) }
    )
  }

  deleteMembro(m: MembroDirettivo) {
    this._dialog.open(ConfirmDialog).afterClosed().subscribe(
      (x: boolean) => { if (x) this._dirsrv.deleteMembro(m); }
    )
  }

  commitChanges(m: MembroDirettivo, ind: number) {
    if (this.initValuesPass[ind] != m.password || this.initValuesUser[ind] != m.user) {
      this._dirsrv.changeMembro(m);
    }
    this.editing[ind] = false;
  }

  revertChanges(m: MembroDirettivo, ind: number) {
    if (this.initValuesPass[ind] != m.password || this.initValuesUser[ind] != m.user) {      
      this._dirsrv.getDirettivo();
    }
    this.editing[ind] = false;
  }
}

class ObservableDataSource implements DataSource<MembroDirettivo>{

  constructor(private _obs: Observable<MembroDirettivo[]>) {

  }

  connect(): Observable<MembroDirettivo[]> {
    return this._obs;
  }

  disconnect() {

  }
}