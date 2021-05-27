import { FormArray, Validators, AbstractControl } from '@angular/forms';

export class UniqueFieldFormArrayValidator extends Validators {

  static validarUnique(campo?: string) {
    return (formArray: AbstractControl) => {
      const erroUnique = { unique: true };

      if ((formArray as FormArray).length <= 1) {
        return null;
      }

      const valores: any[] = campo ? formArray.value.map((control: object) => control[campo]) : formArray.value;
      return valores.length !== new Set<any>(valores).size ? erroUnique : null;
    }
  }
}
