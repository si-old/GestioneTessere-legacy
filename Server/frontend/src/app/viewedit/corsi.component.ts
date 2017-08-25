import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

import { trigger, state, style, animate, transition, group } from '@angular/animations';

import { CdL } from '../common/CdL'
import {CorsiService } from '../corsi/service'

@Component({
    selector: 'corsi-viewedit',
    templateUrl: './corsi.component.html',
    styleUrls: ['./common.component.css'],
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
                animate('0.1s 0.3s ease', style({
                  opacity: 1,
                  height: '*',
                }))
            ]),
            /*transition(':leave', [
                animate('0.1s ease', style({
                  opacity: 0,
                  height: 0,
                }))
            ])/**/
          ])
      ]
})
export class CorsiVieweditComponent implements OnInit{

    @Input() flag: boolean;

    @Output() contentChange: EventEmitter<CdL> = new EventEmitter<CdL>();

    _content: CdL;
    allCdL: CdL[];

    @Input()
    set content(in_content: CdL){
        this._content = in_content;
        this.contentChange.next(this._content);
    }

    get content(){
        return this._content;
    }

    constructor(private _corsisrv: CorsiService){}

    ngOnInit(){
        this._corsisrv.getCorsi().then(
            (corsi: CdL[]) => { this.allCdL = corsi } 
        )
    }
}