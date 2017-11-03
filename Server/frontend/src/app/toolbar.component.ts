import { Component, OnInit, ViewChild } from '@angular/core'

import { MatSidenav } from '@angular/material'
import { Router } from '@angular/router'
import { LoginService } from './login/main.service'

import { HttpClient } from '@angular/common/http'

@Component({
    selector: 'toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {

    @ViewChild('sidenav') private menu: MatSidenav;

    constructor(private _loginsrv: LoginService, private _router: Router,
        private http: HttpClient) {
    }

    get isAdmin() {
        return this._loginsrv.isAdmin();
    }

    get username() {
        return this._loginsrv.getUsername();
    }

    get loggedIn() {
        return this._loginsrv.isLoggedIn();
    }

    toggleMenu() {
        if (this.menu) {
            this.menu.toggle();
        }
    }

    navigateFromSidenav(route: string) {
        if (this.menu) {
            this.menu.close()
        }
        this._router.navigate([route]);
    }

    logout() {
        this._loginsrv.logout();
        this._router.navigate(['/login']);
    }
}