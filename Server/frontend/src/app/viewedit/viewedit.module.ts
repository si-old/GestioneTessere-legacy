import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule } from '@angular/forms'

import { MdInputModule, MdIconModule, MdSlideToggleModule } from '@angular/material'

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { TextVieweditComponent } from './text.component'
import { BoolVieweditComponent } from './bool.component'


@NgModule({
    declarations:[
        TextVieweditComponent,
        BoolVieweditComponent
    ],
    imports: [
        FormsModule,
        BrowserModule,
        MdInputModule,
        MdIconModule,
        MdSlideToggleModule,
        BrowserAnimationsModule
    ],
    exports: [
        TextVieweditComponent,
        BoolVieweditComponent
    ],
    providers: [

    ]
})
export class VieweditModule{

}