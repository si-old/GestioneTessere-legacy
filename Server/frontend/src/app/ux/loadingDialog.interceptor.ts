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

    private static openedDialog: MatDialogRef<LoadingDialog> = null;
    private static opened: number = null;

    constructor(private dialog: MatDialog) { }

    private openDialog() {
        if (!LoadingDialogInterceptor.opened) {
            LoadingDialogInterceptor.opened = window.setTimeout(() => {
                if (!LoadingDialogInterceptor.openedDialog) {
                    LoadingDialogInterceptor.openedDialog = this.dialog.open(LoadingDialog, {
                        id: "loading_dialog",
                    });
                }
            }, DIALOG_DELAY);
        }
    }

    private closeDialog() {
        if (LoadingDialogInterceptor.opened) {
            window.clearTimeout(LoadingDialogInterceptor.opened);
            LoadingDialogInterceptor.opened = null;
        }
        if (LoadingDialogInterceptor.openedDialog) {
            this.dialog.getDialogById('loading_dialog') && this.dialog.getDialogById('loading_dialog').close();
            LoadingDialogInterceptor.openedDialog = null;
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