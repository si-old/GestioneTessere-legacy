import { Component, Input, forwardRef, ViewChild, ElementRef } from '@angular/core'

import { NG_VALUE_ACCESSOR, NG_VALIDATORS,  ControlValueAccessor, Validator, AbstractControl, ValidationErrors } from '@angular/forms'

const noop = () => { };

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => FileUploadComponent),
  multi: true
};

export const CUSTOM_INPUT_CONTROL_VALIDATOR: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => FileUploadComponent),
  multi: true
};

@Component({
  selector: 'file-upload',
  templateUrl: 'file-upload.component.html',
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR, CUSTOM_INPUT_CONTROL_VALIDATOR],
  styles: [
    `.mini-icon{
      width: 24px;
      height: 24px;
      line-height: 24px;
    }`
  ]
})
export class FileUploadComponent implements ControlValueAccessor, Validator {

  @Input('required')  inputRequired: boolean = false
  @Input('show-size') showSize: boolean = true
  @Input()            name: string = '';

  @ViewChild('fileInput') file: ElementRef;

  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;


  _added_files: File[] = [];

  add_file(file: File) {
    this._added_files.push(file);
    this.onChangeCallback(this._added_files);
    this.reset_file();
  }

  remove_file(index: number) {
    this._added_files.splice(index, 1);
    this.onChangeCallback(this._added_files);
  }

  set content(in_files: File[]) {
    if (this._added_files !== in_files) {
      this._added_files = in_files;
      this.onChangeCallback(this._added_files);
    }
  }

  get content() {
    return this._added_files;
  }

  writeValue(value: File[]) {
    this.content = value;
  }

  //From ControlValueAccessor interface
  registerOnChange(fn: (_: any) => void) {
    this.onChangeCallback = fn;
  }

  //From ControlValueAccessor interface
  registerOnTouched(fn: () => void) {
    this.onTouchedCallback = fn;
  }

   validate(c: AbstractControl): ValidationErrors | null {
     return (!this.inputRequired || (Boolean(this._added_files) && this._added_files.length > 0)) ? null : {
       'required' : true
     }
   }

   reset_file(){
     this.file.nativeElement.value = '';
   }
}