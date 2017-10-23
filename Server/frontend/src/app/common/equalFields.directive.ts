import { Directive } from '@angular/core';
import { Validator, FormControl, NG_VALIDATORS, FormGroup } from '@angular/forms';

@Directive({
  selector: '[equalFields]',
  providers: [{ provide: NG_VALIDATORS, useExisting: EqualFieldsValidatorDirective, multi: true }]
})
export class EqualFieldsValidatorDirective implements Validator {
  validate(control: FormGroup): { [key: string]: any } {
    let controlKeys = Object.keys(control.controls);

    if (control) {
      for (let i = 1; i < controlKeys.length; i++) {
        if (control.controls[controlKeys[i]].value != control.controls[controlKeys[i - 1]].value) {
          return { equalFields: false };
        }
      }
    }
    return null;
  }
}