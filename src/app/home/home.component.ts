import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Subject } from 'rxjs';
type ValidateFnCallback = (
  self: FormControl,
  other: FormControl
) => ValidationErrors;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @Output() userData = new Subject<any>();
  form: FormGroup;
  constructor() {
    this.form = this.getFormGroup();
  }

  ngOnInit(): void {}

  submit() {
    let data = {
      name: this.form.value.name,
      age: this.form.value.age,
      experience: this.form.value.experience,
      dni: this.form.value.dni,
      time: this.form.value.time,
    };
    this.userData.next(data);
  }

  getFormGroup(): FormGroup {
    let form: FormGroup;
    form = new FormGroup({
      wanna_help: new FormControl(''),
      name: new FormControl('', Validators.required),
      age: new FormControl('', Validators.required),
      experience: new FormControl('', Validators.required),
      dni: new FormControl('', Validators.required),
      time: new FormControl('', this.requiredWhen('experience', 'Y')),
    });
    return form;
  }

  requiredWhen(
    targetControlName: string,
    targetControlValue: any,
    allowedValue: any = null
  ): any {
    return watchControl(targetControlName, (self, other) => {
      if (other.value !== targetControlValue) {
        return null as any;
      }

      if (
        Validators.required(self) &&
        (allowedValue === null || self.value !== allowedValue)
      ) {
        return { requiredWhen: 'This field is required.' };
      }
      return null as any;
    });
  }
}

function watchControl(targetControlName: string, validate: ValidateFnCallback) {
  let control2: any;
  return (control: FormControl) => {
    const form = <FormGroup>control.root;
    let newControl;
    if (
      !form ||
      !form.controls ||
      !(newControl = form.get(targetControlName))
    ) {
      return null;
    }

    if (control2 !== newControl) {
      control2 = newControl;
      control2.valueChanges.subscribe(() => control.updateValueAndValidity());
    }
    return validate(control, control2);
  };
}
