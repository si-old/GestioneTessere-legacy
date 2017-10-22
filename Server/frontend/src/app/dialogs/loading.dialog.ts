import { Component, Inject } from '@angular/core'

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material'

@Component({
    selector: 'loading-dialog',
    template: `
        <p mat-dialog-title color="primary" class="centered">In attesa di una risposta...</p>
        <div mat-dialog-content><mat-spinner></mat-spinner></div>
    `,
    styleUrls: ['../common/style.css']
})
export class LoadingDialog {
}