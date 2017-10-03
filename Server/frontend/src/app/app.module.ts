import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {
  MdButtonModule,
  MdIconModule,
  MdToolbarModule,
  MdInputModule,
  MdTableModule,
  MdSortModule,
  MdSnackBarModule,
  MdDialogModule,
  MdSlideToggleModule,
  MdSelectModule,
  MdTooltipModule
} from '@angular/material';

import { FormsModule } from '@angular/forms'
import { CdkTableModule } from '@angular/cdk';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { ToolbarComponent } from './toolbar.component'

import { AppRoutingModule } from './app-routing.module';
import { VieweditModule } from './viewedit/viewedit.module'

import { SociComponent } from './soci/main.component'
import { AggiuntaSocioComponent } from './soci/aggiunta.component'
import { SociService } from './soci/main.service'
import { DettagliSocioComponent } from './soci/dettagli.component'

import { DirettivoComponent } from './direttivo/main.component'
import { DirettivoService } from './direttivo/main.service'
import { AggiuntaDirettivoComponent } from './direttivo/aggiunta.component'

import { CorsiComponent } from './corsi/main.component'
import { CorsiService } from './corsi/main.service'

import { TesseramentiService } from './tesseramenti/main.service'
import { TesseramentiComponent } from './tesseramenti/main.component'

import { LoginComponent } from './login/main.component'
import { LoginService, LoggedinGuard, AdminGuard }  from './login/main.service'

import { ConfirmDialog } from './dialogs/confirm.dialog'
import { TextInputDialog } from './dialogs/textinput.dialog'
import { CreateCarrieraDialog } from './dialogs/createcarriera.dialog'
import { CreateTesseraDialog } from './dialogs/createtessera.dialog'

@NgModule({
  declarations: [
    AppComponent,
    SociComponent,
    DirettivoComponent,
    CorsiComponent,
    AggiuntaSocioComponent,
    DettagliSocioComponent,
    TesseramentiComponent,
    ConfirmDialog,
    TextInputDialog,
    CreateCarrieraDialog,
    CreateTesseraDialog,
    LoginComponent,
    ToolbarComponent,
    AggiuntaDirettivoComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MdButtonModule,
    MdIconModule,
    MdToolbarModule,
    MdInputModule,
    MdSnackBarModule,
    MdDialogModule,
    MdTableModule,
    MdSortModule,
    CdkTableModule,
    MdSlideToggleModule,
    MdSelectModule,
    FormsModule,
    VieweditModule,
    MdTooltipModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    SociService,
    CorsiService,
    TesseramentiService,
    DirettivoService,
    LoginService,
    LoggedinGuard,
    AdminGuard
  ],
  entryComponents: [
    AggiuntaSocioComponent,
    DettagliSocioComponent,
    ConfirmDialog,
    CreateCarrieraDialog,
    TextInputDialog,
    CreateTesseraDialog,
    AggiuntaDirettivoComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
