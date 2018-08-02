import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core'

import { MatDialog, MatSnackBar } from '@angular/material'

import { ConfirmDialog } from '../dialogs/confirm.dialog'
import { AggiuntaDirettivoComponent } from './aggiunta.component'

import { MembroDirettivo } from '../model'
import { ObservableDataSource, PATTERN_USER, PATTERN_PASSWORD } from '../common'

import { DirettivoService } from './main.service'

import { Subscription } from 'rxjs'

@Component({
  selector: 'direttivo',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css', '../common/mainroutes.style.css']
})
export class DirettivoComponent implements OnInit, OnDestroy {

  // reexpose pattern to allow template to access them
  PATTERN_USER: string = PATTERN_USER;
  PATTERN_PASSWORD: string = PATTERN_PASSWORD;

  direttivoColumns: string[] = ['user', 'password', 'azioni']
  direttivoSource = null;
  editing: boolean[] = [];

  initValuesUser: string[] = [];
  initValuesPass: string[] = [];

  updateSubscription: Subscription;

  constructor(private _dirsrv: DirettivoService,
    private _changeref: ChangeDetectorRef,
    private _dialog: MatDialog,
    private snackBar: MatSnackBar) {

  }

  ngOnInit() {
    let obs = this._dirsrv.getDirettivo();
    this.direttivoSource = new ObservableDataSource(obs);
    this.updateSubscription = obs.subscribe(
      (direttivo: MembroDirettivo[]) => {
        direttivo.forEach((membro) => {
          this.editing[membro.id_direttivo] = false
          this.initValuesUser[membro.id_direttivo] = membro.user;
          this.initValuesPass[membro.id_direttivo] = membro.password;
        })
      }
    );
    this._changeref.detectChanges();
  }

  ngOnDestroy() {
    this.updateSubscription.unsubscribe();
  }

  addMembro() {
    this._dialog.open(AggiuntaDirettivoComponent).afterClosed().subscribe(
      (x) => { if (x) this._dirsrv.addMembro(x) }
    )
  }

  deleteMembro(m: MembroDirettivo) {
    this._dialog.open(ConfirmDialog).afterClosed().subscribe(
      (x: boolean) => { if (x) this._dirsrv.deleteMembro(m); }
    )
  }

  commitChanges(m: MembroDirettivo) {
    if (m.user || m.password) {
      if (this.initValuesPass[m.id_direttivo] != m.password ||
        this.initValuesUser[m.id_direttivo] != m.user) {
        this._dirsrv.changeMembro(m);
      }
      this.editing[m.id_direttivo] = false;
    } else {
      this.snackBar.open("Tutti i campi sono obbligatori", "Chiudi", {
        duration: 1500
      })
    }
  }

  revertChanges(m: MembroDirettivo) {
    if (this.initValuesPass[m.id_direttivo] != m.password ||
      this.initValuesUser[m.id_direttivo] != m.user) {
      m.user = this.initValuesUser[m.id_direttivo];
      m.password = this.initValuesPass[m.id_direttivo];
    }
    this.editing[m.id_direttivo] = false;
  }
}
