import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler, forwardRef } from '@angular/core';

import { CommonModule } from '@angular/common'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { FormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout'
import { AppComponent } from './app.component';


import { AppRoutingModule } from './app-routing.module';
import { VieweditModule } from './viewedit/viewedit.module'
import { MaterialModule } from './material.module'


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
import { LoginService, LoggedinGuard, AdminGuard } from './login/main.service'

import { MainMailComponent } from './mail/main.component'
import { MailFormComponent } from './mail/mail-form.component'
import { BlacklistComponent } from './mail/blacklist.component'
import { MailService } from './mail/main.service'
import { BlacklistService } from './mail/blacklist.service'

import { LogService } from './log/main.service'
import { LogComponent } from './log/main.component'

import {
  ConfirmDialog, TextInputDialog, CreateCarrieraDialog, ScegliCorsoDialog,
  CreateTesseraDialog, MessageDialog, LoadingDialog
} from './dialogs'

import { ToolbarComponent } from './toolbar.component'
import { TitleBarComponent } from './titlebar.component'

import { DialogErrorHandler, LoadingPlaceholderComponent, LoadingDialogInterceptor } from './ux'

import {
  EqualFieldsValidatorDirective, CheckboxGroupValidatorDirective, NotInArrayValidatorDirective
} from './common'

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
    ScegliCorsoDialog,
    LoginComponent,
    ToolbarComponent,
    TitleBarComponent,
    AggiuntaDirettivoComponent,
    MainMailComponent,
    MailFormComponent,
    BlacklistComponent,
    LogComponent,
    EqualFieldsValidatorDirective,
    CheckboxGroupValidatorDirective,
    NotInArrayValidatorDirective,
    MessageDialog,
    LoadingDialog,
    LoadingPlaceholderComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    VieweditModule,
    HttpClientModule,
    AppRoutingModule,
    MaterialModule,
    FlexLayoutModule
  ],
  providers: [
    SociService,
    CorsiService,
    TesseramentiService,
    DirettivoService,
    LoginService,
    MailService,
    BlacklistService,
    LogService,
    LoggedinGuard,
    AdminGuard,
    { provide: ErrorHandler, useClass: DialogErrorHandler },
    LoadingDialogInterceptor,
    { provide: HTTP_INTERCEPTORS, useExisting: LoadingDialogInterceptor, multi: true}
  ],
  entryComponents: [
    AggiuntaSocioComponent,
    DettagliSocioComponent,
    ConfirmDialog,
    CreateCarrieraDialog,
    TextInputDialog,
    CreateTesseraDialog,
    AggiuntaDirettivoComponent,
    MessageDialog,
    LoadingDialog,
    ScegliCorsoDialog
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
