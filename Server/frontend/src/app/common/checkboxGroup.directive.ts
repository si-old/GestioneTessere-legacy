import { Directive } from '@angular/core';
import { Validator, FormControl, NG_VALIDATORS, FormGroup } from '@angular/forms';

@Directive({
  selector: '[checkboxGroup], [checkbox-group]',
  providers: [{ provide: NG_VALIDATORS, useExisting: CheckboxGroupValidatorDirective, multi: true }]
})
export class CheckboxGroupValidatorDirective implements Validator {
  validate(control: FormGroup): { [key: string]: any } {
    console.log(control);
    return null;
  }
}