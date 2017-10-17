import { Component } from '@angular/core'

@Component({
    selector: "titlebar",
    template:`
        <div class="titlebar">
            <div class="to_left v-centered">
                <ng-content select="[left]"></ng-content>
            </div>
            <div class="centered v-centered">
                <ng-content select="[center]"></ng-content>
            </div>
            <div class="to_right v-centered">
                <ng-content select="[right]"></ng-content>
            </div>
        </div>
    `,
    styleUrls: ['./titlebar.component.css']
})
export class TitleBarComponent{

}