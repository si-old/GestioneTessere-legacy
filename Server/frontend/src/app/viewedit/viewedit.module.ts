import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule } from '@angular/forms'

import { MatInputModule, MatIconModule, MatSlideToggleModule, MatSelectModule } from '@angular/material'

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { TextVieweditComponent } from './text.component'
import { BoolVieweditComponent } from './bool.component'
import { CorsiVieweditComponent } from './corsi.component'
import { CarrieraVieweditComponent } from './carriera.component'


const EXPORTED_COMPONENTS: any = [
    TextVieweditComponent,
    BoolVieweditComponent,
    CorsiVieweditComponent,
    CarrieraVieweditComponent
]

@NgModule({
    declarations: EXPORTED_COMPONENTS,
    imports: [
        FormsModule,
        BrowserModule,
        MatInputModule,
        MatIconModule,
        MatSlideToggleModule,
        MatSelectModule,
        BrowserAnimationsModule
    ],
    exports: EXPORTED_COMPONENTS,
    providers: [
    ]
})
export class VieweditModule {

}