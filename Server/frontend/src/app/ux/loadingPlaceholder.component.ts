import { Component } from '@angular/core'

@Component({
    selector: 'loading-placeholder',
    template: `
    <div class="centered">
        <mat-spinner></mat-spinner>
        <h3 style="padding: 10px 0">Loading...</h3>
    </div>
    `,
    styleUrls: ['../common/style.css'],
    styles: [
        `.mat-spinner{
            margin: 0 auto;
        }`
    ]
})
export class LoadingPlaceholderComponent {
}