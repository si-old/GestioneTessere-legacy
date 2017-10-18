import { Injectable, Injector } from '@angular/core'
import { Router, CanActivate } from '@angular/router'
import {
        HttpClient,
        HttpInterceptor,
        HttpRequest,
        HttpHandler,
        HttpEvent } from '@angular/common/http'

import { MatDialog } from '@angular/material'

import { Observable } from 'rxjs/Observable'

import { HTTP_GLOBAL_OPTIONS } from '../common/all'

import { MessageDialog } from '../dialogs/message.dialog'

const REST_ENDPOINT: string = "https://www.studentingegneria.it/socisi/backend/login.php"

const LSItemKey_admin: string = 'admin';
const LSItemKey_user: string = 'username';
const LSItemKey_expiration: string = 'admin_expiration';
const duration: number = 20 * 60 * 1000 // 20m * 60s * 1000ms


interface LoginAnswer {
    login: boolean
    admin: boolean
}

@Injectable()
export class LoginService {

    timeout: number = null;
    cookie: string = null;

    constructor(private http: HttpClient,
                private _router: Router,
                private _dialog: MatDialog) {

    }

    login(user: string, password: string): Observable<boolean> {
        return this.http.post<LoginAnswer>(
            REST_ENDPOINT,
            { user: user, password: password },
            HTTP_GLOBAL_OPTIONS)
        .map(
            (body) => {
                if (body.login) {
                    localStorage.setItem(LSItemKey_admin, JSON.stringify(body.admin));
                    localStorage.setItem(LSItemKey_user, JSON.stringify(user));
                    this.refreshTimeout();
                }
                return body.login
            }
        )
    }

    refreshTimeout() {
        if (this.timeout) {
            window.clearTimeout(this.timeout);
        }
        this.timeout = window.setTimeout(
            () => {
                this._router.navigate(['/login']);
                this._dialog.open(MessageDialog, {
                    data: {
                        message: "La sessione è scaduta, effetua di nuovo il login!",
                        callback: () => {}
                    }
                });
                localStorage.clear();
                this.cookie = null;
            },
            duration
        )
    }

    logout() {
        localStorage.clear();
        if(this.timeout){
            window.clearTimeout(this.timeout);
        }
        this.http.delete<LoginAnswer>(REST_ENDPOINT, HTTP_GLOBAL_OPTIONS).subscribe(
            () => {}
        )
    }

    isLoggedIn(): boolean {
        let toReturn: boolean = JSON.parse(localStorage.getItem(LSItemKey_admin)) != null;
        if (toReturn) {
            this.refreshTimeout();
        }
        return toReturn;
    }

    isAdmin(): boolean {
        let toReturn: boolean = JSON.parse(localStorage.getItem(LSItemKey_admin));
        if (toReturn) {
            this.refreshTimeout()
        }
        return toReturn;
    }

    getUsername(): string {
        return this.isLoggedIn() ? JSON.parse(localStorage.getItem(LSItemKey_user)) : "";
    }
}

@Injectable()
export class LoggedinGuard implements CanActivate {

    constructor(private _login: LoginService,
        private _router: Router,
        private _dialog: MatDialog) {

    }

    canActivate(): boolean {
        let toReturn: boolean = this._login.isLoggedIn();
        if (!toReturn) {
            this._router.navigate(['/login'])
        }
        return toReturn;
    }
}


@Injectable()
export class AdminGuard implements CanActivate {

    constructor(private _login: LoginService,
        private _router: Router,
        private _dialog: MatDialog) {

    }

    canActivate(): boolean {
        let toReturn: boolean = this._login.isLoggedIn() && this._login.isAdmin();
        if (!toReturn) {
            this._router.navigate(['/login'])
        }
        return toReturn;
    }
}