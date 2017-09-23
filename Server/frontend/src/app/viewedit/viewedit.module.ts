import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule } from '@angular/forms'

import { MdInputModule, MdIconModule, MdSlideToggleModule, MdSelectModule } from '@angular/material'

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { TextVieweditComponent } from './text.component'
import { BoolVieweditComponent } from './bool.component'
import { CorsiVieweditComponent } from './corsi.component'
import { CarrieraVieweditComponent } from './carriera.component'

@NgModule({
    declarations:[
        TextVieweditComponent,
        BoolVieweditComponent,
        CorsiVieweditComponent,
        CarrieraVieweditComponent
    ],
    imports: [
        FormsModule,
        BrowserModule,
        MdInputModule,
        MdIconModule,
        MdSlideToggleModule,
        MdSelectModule,
        BrowserAnimationsModule
    ],
    exports: [
        TextVieweditComponent,
        BoolVieweditComponent,
        CorsiVieweditComponent,
        CarrieraVieweditComponent
    ],
    providers: [
    ]
})
export class VieweditModule{

}