import { Component, OnInit } from '@angular/core'

import { Router } from '@angular/router'
import { LoginService } from './login/main.service'

import { HttpClient } from '@angular/common/http'

@Component({
    selector: 'toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {


    constructor(private _loginsrv: LoginService, private _router: Router,
        private http: HttpClient) {
    }

    dostuff() {
        this.http.post('https://www.studentingegneria.it/socisi/backend/tessera.php', {
            code: 500,
            message: 'cose'
        }).subscribe();
    }

    get isAdmin() {
        return this._loginsrv.isAdmin();
    }

    get username() {
        return this._loginsrv.getUsername();
    }

    logout() {
        this._loginsrv.logout();
        this._router.navigate(['/login']);
    }
}