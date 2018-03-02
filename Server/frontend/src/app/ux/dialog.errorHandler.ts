import { ErrorHandler, Injectable, Injector, NgZone } from '@angular/core'
import { Router } from '@angular/router'
import { MatDialog } from '@angular/material'

import { HttpErrorResponse } from '@angular/common/http'

import { MessageDialog } from '../dialogs/message.dialog'
import { LoginService } from '../login/main.service'


@Injectable()
export class DialogErrorHandler extends ErrorHandler {

    private elaborating: boolean = false;

    constructor(private injector: Injector, private ngzone: NgZone) {
        super();
    }

    handleError(error: any): void {
        if (!this.elaborating) {
            this.elaborating = true;
            let localError = error;
            let finalMessage: string = "Errore sconosciuto";
            let finalCallback: () => void = () => { console.log("default callback") };

            let dialog: MatDialog = this.injector.get(MatDialog);
            let login: LoginService = this.injector.get(LoginService);
            let router: Router = this.injector.get(Router);
            // nessun dialog per TypeError, evita problemi con MatSelect
            if (localError instanceof TypeError) {
                this.elaborating = false;
            } else {
                if (localError instanceof HttpErrorResponse && localError.error instanceof Error) {
                    localError = localError.error
                }
                if (localError instanceof HttpErrorResponse) {
                    let errorDesc = 'Request to ' + localError.url + "\n" + localError.status +
                        " " + localError.statusText + ": " + JSON.stringify(localError.error);
                    switch (localError.status) {
                        case 403:
                            finalMessage = "La sessione è scaduta, ripeti il login.";
                            finalCallback = () => { login.logout(); router.navigate['/login']; };
                            break;
                        case 500:
                            finalMessage = "Errore sul server - " + errorDesc;
                            break;
                        default:
                            finalMessage = errorDesc;
                    }
                } else {
                    finalMessage = localError.message;
                }
                this.ngzone.run(() => {
                    dialog.open(MessageDialog, {
                        data: {
                            message: finalMessage,
                            callback: () => { finalCallback(); this.elaborating = false; }
                        }
                    })
                })
            }
        }
        super.handleError(error);
    }
}