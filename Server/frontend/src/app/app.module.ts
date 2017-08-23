import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MdButtonModule, 
         MdIconModule, 
         MdToolbarModule,
         MdInputModule,
         MdTableModule,
         MdSortModule
       } from '@angular/material';

import { FormsModule } from '@angular/forms'
import { CdkTableModule } from '@angular/cdk';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';

import { AppRoutingModule } from './app-routing.module';
import { VieweditModule } from './viewedit/viewedit.module'

import { SociComponent } from './soci/component'
import { DirettivoComponent } from './direttivo/component'
import { CorsiComponent } from './corsi/component'

import { SociService } from './soci/service'

@NgModule({
  declarations: [
    AppComponent,
    SociComponent,
    DirettivoComponent,
    CorsiComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MdButtonModule,
    MdIconModule,
    MdToolbarModule,
    MdInputModule,
    MdTableModule,
    MdSortModule,
    CdkTableModule,
    FormsModule,
    VieweditModule,
    AppRoutingModule
  ],
  providers: [
    SociService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
