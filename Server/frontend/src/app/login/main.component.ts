import { Component } from '@angular/core'

import { MdSnackBar } from '@angular/material'

@Component({
    selector: 'login',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css', '../common/style.css']
})
export class LoginComponent{
    user: string
    password: string

    error: boolean = true;

    constructor(private mdsnack: MdSnackBar){

    }

    login(){
        this.mdsnack.open("Errore di autenticazione", "OK", {
            duration: 1500,
        })
        return false;
    }

}