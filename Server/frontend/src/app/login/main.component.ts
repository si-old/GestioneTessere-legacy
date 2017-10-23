import { Component, OnInit } from '@angular/core'

import { Router } from '@angular/router'

import { MatSnackBar } from '@angular/material'

import { LoginService } from './main.service'

import { PATTERN_PASSWORD, PATTERN_USER } from '../common'

@Component({
    selector: 'login',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css', '../common/style.css']
})
export class LoginComponent implements OnInit {

    // fix: only import doesn't show in view, must define local variable
    public PATTERN_PASSWORD = PATTERN_PASSWORD;
    public PATTERN_USER = PATTERN_USER;

    user: string
    password: string

    error: boolean = true;

    constructor(private snack: MatSnackBar,
        private _loginsrv: LoginService,
        private _router: Router) {
    }

    ngOnInit() {
        if (this._loginsrv.isLoggedIn()) {
            this._router.navigate(['/soci'])
        }
    }

    login(form) {
        let res: boolean = false;
        if (form.valid) {
            this._loginsrv.login(this.user, this.password).subscribe(
                (res) => {
                    if (res) {
                        this._router.navigate(['/soci'])
                    } else {
                        this.snack.open("Errore di autenticazione", "OK", {
                            duration: 1500,
                        })
                    }
                }
            )
        }
        return false;
    }

}