import { Pipe, PipeTransform } from '@angular/core';

import { EnumTipoUsuario } from '../enums/enum-tipo-usuario.model';

@Pipe({
  name: 'tipoUsuario'
})
export class TipoUsuarioPipe implements PipeTransform {

  transform(value: number): string {
    return value ? EnumTipoUsuario.valueOf(Number(value)).descricao : null;
  }

}
