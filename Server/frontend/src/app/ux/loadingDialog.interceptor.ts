import { Injectable } from '@angular/core'
import {
    HttpInterceptor, HttpRequest, HttpResponse, HttpErrorResponse,
    HttpHandler, HttpEvent
} from '@angular/common/http'
import { MatDialog, MatDialogRef } from '@angular/material'

import { LoadingDialog } from '../dialogs'

import { Observable } from 'rxjs/Observable'

const DIALOG_DELAY: number = 300;

@Injectable()
export class LoadingDialogInterceptor implements HttpInterceptor {

    private static openedDialogRef: MatDialogRef<LoadingDialog> = null;
    private static openedDialog: boolean = false; 
    private static openedTimeout: number = null;

    constructor(private dialog: MatDialog) { }

    private openDialog() {
        if (!LoadingDialogInterceptor.openedDialog && !LoadingDialogInterceptor.openedTimeout) {
            LoadingDialogInterceptor.openedTimeout = window.setTimeout(() => {
                if (!LoadingDialogInterceptor.openedDialog) {
                    LoadingDialogInterceptor.openedDialogRef = this.dialog.open(LoadingDialog, {
                        id: "loading_dialog",
                    });
                    LoadingDialogInterceptor.openedDialog = true;
                }
            }, DIALOG_DELAY);
        }
    }

    private closeDialog() {
        if (LoadingDialogInterceptor.openedTimeout) {
            window.clearTimeout(LoadingDialogInterceptor.openedTimeout);
            LoadingDialogInterceptor.openedTimeout = null;
        }
        if (LoadingDialogInterceptor.openedDialog) {
            LoadingDialogInterceptor.openedDialogRef && LoadingDialogInterceptor.openedDialogRef.close();
            LoadingDialogInterceptor.openedDialogRef = null;
            LoadingDialogInterceptor.openedDialog = false;
        }
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.openDialog();
        return next.handle(req).do(
            {
                next: (ev: HttpEvent<any>) => { if (ev instanceof HttpResponse) this.closeDialog(); },
                error: (err: any) => { if (err instanceof HttpErrorResponse) this.closeDialog(); },
                complete: () => { this.closeDialog(); }
            }
        )
    }
}