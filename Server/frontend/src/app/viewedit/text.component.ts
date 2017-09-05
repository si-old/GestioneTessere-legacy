import { Component, Input, Output, EventEmitter, forwardRef, OnInit } from '@angular/core'

import {
    trigger,
    state,
    style,
    animate,
    transition,
    group
} from '@angular/animations';

import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

const noop = () => {
};

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TextVieweditComponent),
    multi: true
};


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
                animate('0.3s 0.3s ease', style({
                    opacity: 1,
                    height: '*',
                }))
            ])
        ])
    ],
    providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class TextVieweditComponent implements ControlValueAccessor{

    @Input() placeholder: string = 'Placeholder';
    @Input('required') inputRequired: boolean = false
    @Input() name: string;

    @Input() flag: boolean;

    private onTouchedCallback: () => void = noop;
    private onChangeCallback: (_: any) => void = noop;

    _content: string;

    set content(in_content: string) {
        if (this._content !== in_content) {
            this._content = in_content;
            this.onChangeCallback(this._content);
        }
    }

    get content() {
        return this._content;
    }

    writeValue(value: any) {
        this.content = value;
    }

    //From ControlValueAccessor interface
    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    //From ControlValueAccessor interface
    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }
}