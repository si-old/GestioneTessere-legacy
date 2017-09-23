import { Component, OnInit, Input, Output, EventEmitter, forwardRef } from '@angular/core'

import { trigger, state, style, animate, transition, group } from '@angular/animations';

import { CdL } from '../common/all'
import { CorsiService } from '../corsi/main.service'

import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

const noop = () => {
};

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CorsiVieweditComponent),
    multi: true
};


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
            ])
        ])
    ],
    providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class CorsiVieweditComponent implements OnInit, ControlValueAccessor {

    @Input() flag: boolean;
    @Input('required') inputRequired: boolean = false

    _content: CdL;
    allCdL: CdL[];

    constructor(private _corsisrv: CorsiService) { }

    ngOnInit() {
        this._corsisrv.getCorsi().subscribe(
            (corsi: CdL[]) => { this.allCdL = corsi }
        )
    }

    private onTouchedCallback: () => void = noop;
    private onChangeCallback: (_: any) => void = noop;

    set content(in_content: CdL) {
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