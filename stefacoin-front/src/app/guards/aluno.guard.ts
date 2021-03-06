import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, UrlSegment } from '@angular/router';

import { EnumTipoUsuario } from '../enums/enum-tipo-usuario.model';
import { TipoUsuarioGuard } from './tipo-usuario.guard';

@Injectable({
  providedIn: 'root'
})
export class AlunoGuard extends TipoUsuarioGuard implements CanActivate, CanActivateChild {

  protected verificarTipo(url: UrlSegment[]) {
    const isEdicao = url.some(segment => segment.path.includes('editar'));
    const usuario = this.auth.getUsuario();
    
    if (isEdicao) {
      const extras = this.router.getCurrentNavigation().extras?.state;
      return extras.id && usuario.id === extras.id || EnumTipoUsuario.is.PROFESSOR(usuario.tipo);
    }

    return true;
  }

}
