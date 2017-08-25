import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MdButtonModule, 
         MdIconModule, 
         MdToolbarModule,
         MdInputModule,
         MdTableModule,
         MdSortModule,
         MdSnackBarModule,
         MdDialogModule,
         MdSlideToggleModule,
         MdSelectModule
       } from '@angular/material';

import { FormsModule } from '@angular/forms'
import { CdkTableModule } from '@angular/cdk';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';

import { AppRoutingModule } from './app-routing.module';
import { VieweditModule } from './viewedit/viewedit.module'

import { SociComponent } from './soci/component'
import { AggiuntaSocioComponent } from './soci/aggiunta.component'
import { SociService } from './soci/service'

import { DirettivoComponent } from './direttivo/component'

import { CorsiComponent } from './corsi/component'
import { CorsiService } from './corsi/service'

@NgModule({
  declarations: [
    AppComponent,
    SociComponent,
    DirettivoComponent,
    CorsiComponent,
    AggiuntaSocioComponent
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
    AppRoutingModule
  ],
  providers: [
    SociService,
    CorsiService
  ],
  entryComponents:[
    AggiuntaSocioComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
