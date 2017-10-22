import { Component, Inject } from '@angular/core'

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material'

@Component({
    selector: 'loading-dialog',
    template: `
        <p mat-dialog-title color="primary" class="centered">In attesa di una risposta...</p>
        <div mat-dialog-content class="spinner-div">
            <mat-spinner></mat-spinner>
        </div>
    `,
    styles: [`
        .spinner-div{
            overflow: hidden;
            display: flex;
            justify-content: center;
        }
    `]
})
export class LoadingDialog {
}