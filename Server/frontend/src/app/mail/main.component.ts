import { Component, EventEmitter } from '@angular/core'

import { ActivatedRoute, Router } from '@angular/router'

import { MatTabChangeEvent } from '@angular/material'

@Component({
    selector: 'main-mail',
    template: `
        <titlebar>
            <h2 center>Gestione E-Mail</h2>
        </titlebar>
        <mat-tab-group>
            <mat-tab label="Nuova e-mail">
                <mail-form></mail-form>
            </mat-tab>
            <mat-tab label="Blacklist">
                <blacklist></blacklist>
            </mat-tab>
        </mat-tab-group>
    `
})
export class MainMailComponent {
}