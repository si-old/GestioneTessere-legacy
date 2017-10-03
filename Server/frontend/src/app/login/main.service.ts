import { Injectable } from '@angular/core'
import { Router, CanActivate } from '@angular/router'

const LSItemKey: string = 'admin';
const LSItemKey_expiration: string = 'admin_expiration';
const duration: number = 24 * 60 * 60 * 1000 // 24h * 60m * 60s * 1000ms

@Injectable()
export class LoginService {

    login(user: string, password: string): boolean {
        let admin: boolean = false;
        let res: boolean = true;
        if (user == 'admin') {
            admin = true;
        }
        localStorage.setItem(LSItemKey, JSON.stringify(admin));
        localStorage.setItem(LSItemKey_expiration, JSON.stringify(new Date().getTime()));
        return res;
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
        return JSON.parse(localStorage.getItem(LSItemKey)) != null;
    }

    isAdmin(): boolean {
        this.check_expiration();
        return JSON.parse(localStorage.getItem(LSItemKey));
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