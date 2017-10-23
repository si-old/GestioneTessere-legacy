import { Component } from '@angular/core'

import { ActivatedRoute, UrlSegment} from '@angular/router'

import {
    trigger,
    state,
    style,
    animate,
    transition,
    group
} from '@angular/animations';

@Component({
    selector: 'main-mail',
    template: `
        <titlebar>
            <h2 center>Gestione email</h2>
        </titlebar>
        <div style="width: max-content">
            <nav mat-tab-nav-bar>
                <a mat-tab-link routerLink="/mail/send" [active]="!showBlacklist">Nuova email</a>
                <a mat-tab-link routerLink="/mail/blacklist" [active]="showBlacklist">Blacklist</a>
            </nav>
        </div>
        <mail-form *ngIf="!showBlacklist" [@flyInOut]></mail-form>
        <blacklist *ngIf="showBlacklist" [@flyInOut]></blacklist>
       `,
       styles:[
           `.mat-tab-links{
               border: 1px red solid;
           }`
       ],
       animations: [
        trigger('flyInOut', [
            state('in', style({
                opacity: 1,
                height: '*',
            })),
            transition(':enter', [
                style({
                    opacity: 0,
                    height: 0,
                }),
                animate('0.3s 0.3s ease', style({
                    opacity: 1,
                    height: '*',
                }))
            ])
        ])
    ]
})
export class MainMailComponent {

    showBlacklist: boolean = false;

    constructor(private route: ActivatedRoute) {
        route.url.subscribe(
            (segments: UrlSegment[]) => {
                if (segments[segments.length-1].path == 'blacklist') {
                    this.showBlacklist = true;
                }
            }
        )
    }
} 