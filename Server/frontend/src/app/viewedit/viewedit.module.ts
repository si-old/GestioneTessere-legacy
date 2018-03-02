import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule } from '@angular/forms'

import { MatInputModule, MatIconModule, MatSlideToggleModule, 
         MatSelectModule, MatButtonModule } from '@angular/material'

import { FlexLayoutModule } from '@angular/flex-layout'

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FileSizeFormatPipe } from '../common'


import { TextVieweditComponent } from './text.component'
import { BoolVieweditComponent } from './bool.component'
import { CorsiVieweditComponent } from './corsi.component'
import { CarrieraVieweditComponent } from './carriera.component'
import { FileUploadComponent } from './file-upload.component'


const EXPORTED_COMPONENTS: any = [
    TextVieweditComponent,
    BoolVieweditComponent,
    CorsiVieweditComponent,
    CarrieraVieweditComponent,
    FileUploadComponent
]

@NgModule({
    declarations: [...EXPORTED_COMPONENTS, FileSizeFormatPipe ],
    imports: [
        FormsModule,
        MatButtonModule,
        BrowserModule,
        MatInputModule,
        MatIconModule,
        MatSlideToggleModule,
        MatSelectModule,
        BrowserAnimationsModule,
        FlexLayoutModule
    ],
    exports: EXPORTED_COMPONENTS,
    providers: [
    ]
})
export class VieweditModule {

}