import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators, FormArray } from '@angular/forms';

import { ToastService } from './../services/toast.service';

export abstract class FormUtils {

  static forceValidateAllFormFields(formGroup: FormGroup | FormArray, callBackIfValid: () => void = null, toast: boolean = true) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl && control.enabled) {
        control.markAsTouched({ onlySelf: true });
        control.markAsDirty({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.forceValidateAllFormFields(control, null, false);
      } else if (control instanceof FormArray) {
        for (const item of control.controls) {
          if (item instanceof FormGroup || item instanceof FormArray) {
            this.forceValidateAllFormFields(item, null, false);
          } else if (item instanceof FormControl) {
            item.markAsTouched({ onlySelf: true });
            item.markAsDirty({ onlySelf: true });
          }
        }
      }
    });

    FormUtils.verificarValidade(formGroup, callBackIfValid, toast);
  }

  private static verificarValidade(formGroup: FormGroup | FormArray, callBackIfValid: () => void, toast: boolean) {
    if (formGroup.valid) {
      if (callBackIfValid) {
        callBackIfValid();
      }
    } else {
      if (toast) {
        ToastService.instance.aviso('Preencha os campos obrigatórios.');
      }
    }
  }

  static markAllControlsAsTouched(form: FormGroup): void {
    const controls = form.controls;
    for (const name in controls) {
      if (controls.hasOwnProperty(name)) {
        if (controls[name] instanceof FormGroup) {
          FormUtils.markAllControlsAsTouched(controls[name] as FormGroup);
        } else {
          controls[name].markAsTouched();
        }
      }
    }
  }

  static markAllControlsAsUnTouched(form: FormGroup): void {
    const controls = form.controls;
    for (const name in controls) {
      if (controls.hasOwnProperty(name)) {
        if (controls[name] instanceof FormGroup) {
          FormUtils.markAllControlsAsUnTouched(controls[name] as FormGroup);
        } else {
          controls[name].markAsUntouched();
        }
      }
    }
  }

  static retirarValidatorsEResetarValor(control: AbstractControl): void {
    control.reset();
    control.clearValidators();
  }

  static retirarObrigatoriedadeDeControlEResetarValor(control: AbstractControl): void {
    control.reset();
    this.retirarObrigatoriedadeDeControlSemResetarValor(control);
  }

  static retirarObrigatoriedadeDeControlSemResetarValor(control: AbstractControl): void {
    control.clearValidators();
    control.updateValueAndValidity();
  }

  static tornarControlObrigatorioSemResetarValor(control: AbstractControl): void {
    control.setValidators([Validators.required]);
    control.updateValueAndValidity();
  }

  static tornarControlObrigatorioSemResetarValorComValidators(control: AbstractControl, validators: ValidatorFn[]): void {
    control.setValidators([Validators.required].concat(validators));
    control.updateValueAndValidity();
  }

  static tornarControlObrigatorioEResetarValor(control: AbstractControl): void {
    control.reset();
    this.tornarControlObrigatorioSemResetarValor(control);
  }

  static tornarControlObrigatorioEResetarValorComValidators(control: AbstractControl, validators: ValidatorFn[]): void {
    control.reset();
    control.setValidators(validators);
  }

  static retirarObrigatoriedadeDeControlEResetarValorComValidators(control: AbstractControl, validators: ValidatorFn[]): void {
    control.reset();
    control.clearValidators();
    control.setValidators(validators);
    control.updateValueAndValidity();
  }

  static retirarObrigatoriedadeDeControlSemResetarValorComValidators(control: AbstractControl, validators: ValidatorFn[]): void {
    control.clearValidators();
    control.setValidators(validators);
    control.updateValueAndValidity();
  }

  static peloMenosUmValidador = (validator: ValidatorFn, controls: AbstractControl[] = null) => (group: FormGroup): ValidationErrors => {
    if (!controls) {
      controls = Object.values(group.controls);
    }
    const temPeloMenosUm = group && group.controls && controls.some(c => !validator(c));
    return temPeloMenosUm ? null : { peloMenosUm: temPeloMenosUm };
  }

  static retiraObrigatoriedadeEDesabilitaControlSemResetarValor(control: AbstractControl): void {
    control.disable();
    control.clearValidators();
    control.updateValueAndValidity();
  }

  static retiraObrigatoriedadeDesabilitaEresetaControl(control: AbstractControl): void {
    control.disable();
    control.reset();
    control.clearValidators();
    control.updateValueAndValidity();
  }

  static tornarControlObrigatorioEhabilitado(control: AbstractControl): void {
    control.setValidators([Validators.required]);
    control.enable();
    control.updateValueAndValidity();
  }

  static tornarControlObrigatorioEhabilitadoComValidators(control: AbstractControl, validators: ValidatorFn[]): void {
    control.enable();
    this.tornarControlObrigatorioSemResetarValorComValidators(control, validators);
  }

  static capitalize(object: any) {
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        const value = object[key];
        let newValue = value;
        if (typeof value !== 'object') {
          if (typeof value === 'string') {
            newValue = value.toUpperCase().trim();
          }
        } else {
          newValue = this.capitalize(value);
        }
        object[key] = newValue;
      }
    }
    return object;
  }

}
