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
    selector: 'text-viewedit',
    templateUrl: './text.component.html',
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
export class TextVieweditComponent{

    @Input() placeholder: string = 'Placeholder';

    @Input() flag: boolean;

    @Output() contentChange: EventEmitter<string> = new EventEmitter<string>();

    
    _content: string;
    
    @Input()
    set content(in_content: string){
        this._content = in_content;
        this.contentChange.next(this._content);
    }

    get content(){
        return this._content;
    }
}