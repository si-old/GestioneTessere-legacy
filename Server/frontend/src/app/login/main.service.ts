import { Injectable, Injector } from '@angular/core'
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import {
    HttpClient,
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent
} from '@angular/common/http'

import { MatDialog } from '@angular/material'

import { Observable } from 'rxjs/Observable'

import { HTTP_GLOBAL_OPTIONS, BACKEND_SERVER } from '../common'

import { MessageDialog } from '../dialogs/message.dialog'

const REST_ENDPOINT: string = BACKEND_SERVER + "login.php"

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
                    localStorage.setItem(LSItemKey_expiration, JSON.stringify(Date.now()));
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
                    }
                });
                this.resetSession();
            },
            duration
        )
    }

    validateSession() {
        let last_time = JSON.parse(localStorage.getItem(LSItemKey_expiration));
        let this_time = Date.now();
        if (last_time && this_time - last_time < duration) {
            this.refreshTimeout()
            localStorage.setItem(LSItemKey_expiration, JSON.stringify(this_time));
        } else {
            this.resetSession();
        }
    }

    private resetSession() {
        localStorage.clear();
        if (this.timeout) {
            window.clearTimeout(this.timeout);
        }
    }

    logout() {
        this.resetSession();
        this.http.delete<LoginAnswer>(REST_ENDPOINT, HTTP_GLOBAL_OPTIONS).subscribe(
            () => {}
        )
    }

    isLoggedIn(): boolean {
        this.validateSession();
        return JSON.parse(localStorage.getItem(LSItemKey_admin)) != null;
    }

    isAdmin(): boolean {
        this.validateSession();
        return JSON.parse(localStorage.getItem(LSItemKey_admin));
    }

    getUsername(): string {
        return this.isLoggedIn() ? JSON.parse(localStorage.getItem(LSItemKey_user)) : "";
    }
}

@Injectable()
export class LoggedinGuard implements CanActivate {

    constructor(private _login: LoginService,
        private _router: Router) {

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let toReturn: boolean = this._login.isLoggedIn();
        if (!toReturn) {
            this._router.navigate(['/login'], {
                queryParams: {
                    return: encodeURI(state.url)
                }
            })
        }
        return toReturn;
    }
}


@Injectable()
export class AdminGuard implements CanActivate {

    constructor(private _login: LoginService,
        private _router: Router, private _dialog: MatDialog) {

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let toReturn: boolean = this._login.isLoggedIn() && this._login.isAdmin();
        if (!toReturn) {
            if (this._login.isLoggedIn()) {
                this._router.navigate(['/soci']);
                this._dialog.open(MessageDialog, {
                    data: {
                        message: "Non hai abbastanza permessi per accedere alla sezione!",
                    }
                });
            } else {
                this._router.navigate(['/login'], {
                    queryParams: {
                        return: encodeURI(state.url)
                    }
                })
            }
        }
        return toReturn;
    }
}