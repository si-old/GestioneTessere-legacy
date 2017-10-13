import { ErrorHandler, Injectable, Injector } from '@angular/core'

import { MatDialog } from '@angular/material'

import { MessageDialog } from '../dialogs/message.dialog'


@Injectable()
export class DialogErrorHandler implements ErrorHandler{
    
    constructor(private injector: Injector){

    }

    handleError(error: any): void{
        console.error(error);
        let dialog : MatDialog = this.injector.get(MatDialog);
        dialog.open(MessageDialog, {
            data: {
                message: error.toString(),
                callback: () => { location.reload() }
            }
        })
    }
}