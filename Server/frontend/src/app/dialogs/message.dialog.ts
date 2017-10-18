import { Component, Inject } from '@angular/core'

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material'

@Component({
    selector: 'message-dialog',
    template: `
        <p mat-dialog-title color="primary" class="centered">Attenzione</p>
        <div mat-dialog-content>{{message}}</div>
        <div mat-dialog-actions style="display: flex; justify-content: center">
            <button mat-button mat-dialog-close (click)="handleClick()">
                OK
            </button>
        </div>
    `,
    styleUrls: ['../common/style.css']
})
export class MessageDialog {

    message: string = "cose";
    callback: () => void;

    constructor( @Inject(MAT_DIALOG_DATA) private data,
        private diagref: MatDialogRef<MessageDialog>) {
        if (data) {
            this.message = data.message;
            this.callback = data.callback;
        }
    }

    handleClick() {
        this.diagref.close();
        if (this.callback) {
            this.callback();
        }
    }
}