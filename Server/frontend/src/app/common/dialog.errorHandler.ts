import { ErrorHandler, Injectable, Injector } from '@angular/core'
// import { Router } from '@angular/router'
import { MatDialog, MatSnackBar } from '@angular/material'

import { HttpErrorResponse } from '@angular/common/http'

import { MessageDialog } from '../dialogs/message.dialog'
// import { LoginService } from '../login/main.service'


@Injectable()
export class DialogErrorHandler extends ErrorHandler {

    constructor(private injector: Injector) {
        super();
    }

    handleError(error: any): void {
        // let localError = error;
        // let finalMessage: string = "Errore sconosciuto";
        // let finalCallback: () => void = () => { console.log("default callback")};

        // let dialog: MatDialog = this.injector.get(MatDialog);
        // let snackbar: MatSnackBar = this.injector.get(MatSnackBar);
        // // let login: LoginService = this.injector.get(LoginService);
        // // let router: Router = this.injector.get(Router);
        // if( localError instanceof HttpErrorResponse && localError.error instanceof Error){
        //     localError = localError.error
        // }
        // if ( localError.status && localError.statusText && localError.error ){
        //     let errorDesc = localError.status + " " + localError.statusText + ": ";
        //     switch (localError.status) {
        //         case 403:
        //             finalMessage = "La sessione è scaduta, ripeti il login.";
        //             // finalCallback = () => { login.logout(); router.navigate['/login']; };
        //             break;
        //         case 500:
        //             finalMessage = "Errore sul server - " + errorDesc + localError.error;
        //             break;
        //         default:
        //             finalMessage = errorDesc;
        //     }
        // } else {
        //     finalMessage = localError.toString();
        //     finalCallback = () => { location.reload() };
        // }
        // snackbar.open(finalMessage, "CHIUDI", {
        //     duration: 1500
        // }).afterDismissed().subscribe(
        //     () => {finalCallback()}
        // )
        // throw error;
        super.handleError(error);
    }
}