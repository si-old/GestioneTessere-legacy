import { Component } from '@angular/core'

@Component({
    selector: 'toolbar',
    template: `
    <md-toolbar color="primary">
        <a md-raised-button class="custom-button" color="accent" routerLink="/soci">Soci</a>
        <a md-raised-button class="custom-button" color="accent" routerLink="/corsi">Corsi di Laurea</a>
        <a md-raised-button class="custom-button" color="accent" routerLink="/tesseramenti">Tesseramenti</a>
    </md-toolbar>
    `,
    styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {

}