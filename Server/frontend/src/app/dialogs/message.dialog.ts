import { Component, Inject } from '@angular/core'

import { MAT_DIALOG_DATA } from '@angular/material'

@Component({
    selector: 'message-dialog',
    template: `
        <p mat-dialog-title color="primary" class="centered">Attenzione</p>
        <div mat-dialog-content>
            {{message}}
        </div>
        <div mat-dialog-actions>
            <button mat-button mat-close-button (click)="handleClick()">
                OK
            </button>
        </div>
    `,
    styleUrls: ['../common/style.css']
})
export class MessageDialog{

    message: string;
    callback : () => void;
    
    constructor(@Inject(MAT_DIALOG_DATA) private data){
        if(data){
            this.message = data.message;
            this.callback = data.callback;
        }
    }
    
    handleClick(){
        if(this.callback){
            this.callback();
        }
    }
}