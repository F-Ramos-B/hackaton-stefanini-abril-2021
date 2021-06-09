import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators, FormArray } from '@angular/forms';

import { ToastService } from './../services/toast.service';

export abstract class FormUtils {

  static forceValidateAllFormFields(form: FormGroup | FormArray) {
    Object.keys(form.controls).forEach(field => {
      const control = form.get(field);
      if (control instanceof FormControl && control.enabled) {
        control.markAsTouched({ onlySelf: true });
        control.markAsDirty({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.forceValidateAllFormFields(control);
      } else if (control instanceof FormArray) {
        for (const item of control.controls) {
          if (item instanceof FormGroup || item instanceof FormArray) {
            this.forceValidateAllFormFields(item);
          } else if (item instanceof FormControl && control.enabled) {
            item.markAsTouched({ onlySelf: true });
            item.markAsDirty({ onlySelf: true });
          }
        }
      }
    });
  }

  static forceValidateForm(form: FormGroup | FormArray, callBackIfValid: () => void = null, toast: boolean = true) {
    this.forceValidateAllFormFields(form);

    if (form.valid) {
      if (callBackIfValid) {
        callBackIfValid();
      }
    } else {
      if (toast) {
        ToastService.getInstance().aviso('Preencha os campos obrigatórios.');
      }
    }
  }

  static getFormErrors(form: AbstractControl) {
    if (form instanceof FormControl) {
      // Return FormControl errors or null
      return form.errors ?? null;
    }
    if (form instanceof FormGroup || form instanceof FormArray) {
      const groupErrors = form.errors;
      // Form group can contain errors itself, in that case add'em
      const formErrors = groupErrors ? { groupErrors } : {};
      Object.keys(form.controls).forEach(key => {
        // Recursive call of the FormGroup fields
        const error = this.getFormErrors(form.get(key));
        if (error !== null) {
          // Only add error if not null
          formErrors[key] = error;
        }
      });
      // Return FormGroup errors or null
      return Object.keys(formErrors).length > 0 ? formErrors : null;
    }
  }

  static achatarErros(form: AbstractControl) {
    const erros = this.getFormErrors(form);
    const errosAchatados = FormUtils.achatarObjeto(erros);
    return Object.keys(errosAchatados).length ? errosAchatados : null;
  }

  private static achatarObjeto(errors: ValidationErrors): ValidationErrors {
    return !errors ? {} : Object.keys(errors).reduce((acc, key) => {
      if (typeof errors[key] === 'object') {
        return {
          ...acc,
          ...this.achatarObjeto(errors[key])
        }
      }
      return {
        ...acc,
        [key]: errors[key]
      }
    }, {});
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
