import { Injectable } from '@angular/core'
import { Router, CanActivate } from '@angular/router'

import { HttpClient } from '@angular/common/http'

import { Observable } from 'rxjs/Observable'

const REST_ENDPOINT: string = "https://www.studentingegneria.it/socisi/backend/login.php"

const LSItemKey_admin: string = 'admin';
const LSItemKey_user: string = 'username';
const LSItemKey_expiration: string = 'admin_expiration';
const duration: number = 24 * 60 * 60 * 1000 // 24h * 60m * 60s * 1000ms

@Injectable()
export class LoginService {

    constructor(private http: HttpClient) {

    }

    login(user: string, password: string): Observable<boolean> {
        return this.http.post<LoginAnswer>(REST_ENDPOINT, JSON.stringify({
            user: user,
            password: password
        })).map(
            (answer) => {
                if (answer.result) {
                    localStorage.setItem(LSItemKey_admin, JSON.stringify(answer.admin));
                    localStorage.setItem(LSItemKey_user, JSON.stringify(user));
                    localStorage.setItem(LSItemKey_expiration, JSON.stringify(new Date().getTime()));
                }
                return answer.result
            }
            )
    }

    logout() {
        localStorage.clear();
    }

    check_expiration() {
        let old_time = JSON.parse(localStorage.getItem(LSItemKey_expiration));
        let new_time = new Date().getTime();
        if (old_time && (new_time - old_time) > duration) {
            localStorage.clear();
        }
    }

    isLoggedIn(): boolean {
        this.check_expiration();
        return JSON.parse(localStorage.getItem(LSItemKey_admin)) != null;
    }

    isAdmin(): boolean {
        this.check_expiration();
        return JSON.parse(localStorage.getItem(LSItemKey_admin));
    }

    getUsername(): string{
        return this.isLoggedIn() ? JSON.parse(localStorage.getItem(LSItemKey_user)) : "";
    }
}

@Injectable()
export class LoggedinGuard implements CanActivate {

    constructor(private _login: LoginService, private _router: Router) {

    }

    canActivate(): boolean {
        let toReturn: boolean = this._login.isLoggedIn();
        if (!toReturn) {
            this._router.navigate(['/login'])
        }
        return toReturn
    }
}


@Injectable()
export class AdminGuard implements CanActivate {

    constructor(private _login: LoginService, private _router: Router) {

    }

    canActivate(): boolean {
        let toReturn: boolean = this._login.isLoggedIn() && this._login.isAdmin();
        if (!toReturn) {
            this._router.navigate(['/login'])
        }
        return toReturn
    }
}

interface LoginAnswer {
    result: boolean
    admin: boolean
}