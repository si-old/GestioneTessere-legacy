import { Directive, Input } from '@angular/core';
import { Validator, FormControl, NG_VALIDATORS, FormGroup } from '@angular/forms';


@Directive({
  selector: '[checkboxGroup], [checkbox-group]',
  providers: [{ provide: NG_VALIDATORS, useExisting: CheckboxGroupValidatorDirective, multi: true }]
})
export class CheckboxGroupValidatorDirective implements Validator {

  validate(group: FormGroup): { [key: string]: any } {
    let controls = group.controls;
    let checkboxes = Object.keys(controls);
    let valid: boolean = false;
    checkboxes.forEach(
      (checkbox: string) => {
        if (controls[checkbox].value) {
          valid = true;
        }
      }
    )
    if (valid) {
      return null;
    }
    return { 'checkboxGroup': true };
  }
}

