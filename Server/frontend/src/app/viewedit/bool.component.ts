import { Component, Input, Output, EventEmitter } from '@angular/core'

import {
    trigger,
    state,
    style,
    animate,
    transition,
    group
  } from '@angular/animations';

@Component({
    selector: 'bool-viewedit',
    templateUrl: './bool.component.html',
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
export class BoolVieweditComponent{

    @Input() flag: boolean;
    
    _content: boolean;
    @Output() contentChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Input()
    set content(in_content: boolean){
        this._content = in_content;
        this.contentChange.next(this._content);
    }

    get content(){
        return this._content;
    }
}