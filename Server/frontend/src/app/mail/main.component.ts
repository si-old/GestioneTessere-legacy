import { Component, EventEmitter } from '@angular/core'

import { ActivatedRoute, Router } from '@angular/router'

import { MatTabChangeEvent } from '@angular/material'

@Component({
    selector: 'main-mail',
    template: `
        <titlebar>
            <h2 center>Gestione E-Mail</h2>
        </titlebar>
        <mat-tab-group [selectedIndex]="selectedTab" (selectedTab)="tabChange" >
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

    selectedTab: number = 0;

    subscription: any;

    set tabChange(newValue: EventEmitter<MatTabChangeEvent>){
        if(this.subscription){
            this.subscription.unsubscribe();
        }
        this.subscription = newValue.subscribe(
            (event: MatTabChangeEvent) => {
                if(event.index == 0){
                    this.router.navigate(['/mail/send']);
                }else if(event.index == 1){
                    this.router.navigate(['/mail/blacklist']);
                }
            }
        )
    }

    constructor(private route: ActivatedRoute, private router: Router) {
        this.route.data.subscribe(
            (data: any) => {
                if (data.tab == 'blacklist') {
                    this.selectedTab = 1;
                } else {
                    this.selectedTab = 0;
                }
            }
        )
    }

    ngOnInit(){
        this.tabChange
    }
}