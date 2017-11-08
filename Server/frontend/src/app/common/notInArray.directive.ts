import { Directive, Input } from '@angular/core';
import { Validator, FormControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
    selector: '[notInArray]',
    providers: [{ provide: NG_VALIDATORS, useExisting: NotInArrayValidatorDirective, multi: true }]
})
export class NotInArrayValidatorDirective implements Validator {

    @Input('notInArray') array: number[];

    validate(control: FormControl): { [key: string]: any } {
        if (this.array.includes(Number(control.value))) {
            return { notInArray: true }
        }
        return null;
    }
}