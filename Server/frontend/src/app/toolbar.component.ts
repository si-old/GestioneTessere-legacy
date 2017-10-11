import { Component, OnInit } from '@angular/core'

import { Router } from '@angular/router'
import { LoginService } from './login/main.service'

@Component({
    selector: 'toolbar',
    template: `
    <mat-toolbar color="primary">
        <a mat-raised-button class="custom-button" color="accent" routerLink="/soci">Soci</a>
        <a mat-raised-button class="custom-button" color="accent" routerLink="/corsi">Corsi di Laurea</a>
        <a mat-raised-button class="custom-button" color="accent" routerLink="/tesseramenti">Tesseramenti</a>
        <ng-container *ngIf="isAdmin">
            <a mat-raised-button class="custom-button" color="accent" routerLink="/direttivo">Direttivo</a>
        </ng-container>
        <div class="full-size">
            <div class="to-right">
                Ciao {{username}}
                <button mat-fab color="accent" class="right-button" (click)="logout()">
                    <mat-icon matTooltip="Logout" matTooltipPosition="below">power_settings_new</mat-icon>
                </button>
            </div>
        </div>
    </mat-toolbar>
    `,
    styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent{

    get isAdmin(){
        return this._loginsrv.isAdmin();
    }

    get username(){
        return this._loginsrv.getUsername();        
    }

    constructor(private _loginsrv: LoginService, private _router: Router) {
    }

    logout() {
        this._loginsrv.logout();
        this._router.navigate(['/login']);
    }
}