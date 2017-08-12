import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MdButtonModule, MdIconModule, MdToolbarModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';

import { AppRoutingModule } from './app-routing.module';


import { SociComponent } from './soci/component'
import { DirettivoComponent } from './direttivo/component'
import { CorsiComponent } from './corsi/component'


@NgModule({
  declarations: [
    AppComponent,
    SociComponent,
    DirettivoComponent,
    CorsiComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MdButtonModule,
    MdIconModule,
    MdToolbarModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
