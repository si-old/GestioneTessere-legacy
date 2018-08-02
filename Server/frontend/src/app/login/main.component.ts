import { Component, OnInit } from '@angular/core'

import { Router, ActivatedRoute } from '@angular/router'

import { MatSnackBar, MatDialog } from '@angular/material'

import { LoginService } from './main.service'
import { MessageDialog } from '../dialogs'

import { PATTERN_PASSWORD, PATTERN_USER, VERSION } from '../common'

@Component({
    selector: 'login',
    templateUrl: './main.component.html',
    styleUrls: ['../common/style.css']
})
export class LoginComponent implements OnInit {

    // fix: only import doesn't show in view, must define local variable
    public PATTERN_PASSWORD = PATTERN_PASSWORD;
    public PATTERN_USER = PATTERN_USER;
    public VERSION = VERSION;

    user: string
    password: string

    error: boolean = true;
    return: string = '/soci';

    hidden: boolean = true;

    countEasterEgg: number = 0;

    constructor(private snack: MatSnackBar,
        private _loginsrv: LoginService,
        private _router: Router,
        private _route: ActivatedRoute,
        private dialog: MatDialog) {
    }

    ngOnInit() {
        this._route.queryParams.subscribe(
            (query: any) => {
                if (query.return) {
                    this.return = decodeURI(query.return);
                }
                if (this._loginsrv.isLoggedIn()) {
                    this._router.navigate([this.return]);
                }
            }
        )
    }

    login(form) {
        let res: boolean = false;
        if (form.valid) {
            this._loginsrv.login(this.user, this.password).subscribe(
                (res) => {
                    if (res) {
                        this._router.navigate([this.return])
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

    easterEgg(){
        if(this.countEasterEgg < 7){
            this.countEasterEgg++
        }else{
            this.dialog.open(MessageDialog, {
                data: {
                    message: "Il presidente è fighissimo!",
                }
            });
            this.countEasterEgg = 0;
        }
    }

}