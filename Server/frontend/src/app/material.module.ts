import { NgModule } from '@angular/core'

import {
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatSnackBarModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatCheckboxModule,
    MatListModule,
    MatPaginatorModule,
    MatSidenavModule
  } from '@angular/material';

  import { CdkTableModule } from '@angular/cdk/table';
  
const INCLUDED_MODULES = [
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatInputModule,
    MatTableModule,
    CdkTableModule,
    MatSortModule,
    MatSnackBarModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatCheckboxModule,
    MatListModule,
    MatPaginatorModule,
    MatSidenavModule
]

@NgModule({
    imports: INCLUDED_MODULES,
    exports: INCLUDED_MODULES
})
export class MaterialModule{

}