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
            <button mat-fab color="accent" class="right-button" (click)="logout()">
                <mat-icon mdTooltip="Logout" mdTooltipPosition="below">power_settings_new</mat-icon>
            </button>
        </div>
    </mat-toolbar>
    `,
    styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

    isAdmin: boolean = false;

    constructor(private _loginsrv: LoginService, private _router: Router) {
    }

    ngOnInit() {
        this.isAdmin = this._loginsrv.isAdmin();
    }

    logout() {
        this._loginsrv.logout();
        this._router.navigate(['/login']);
    }
}