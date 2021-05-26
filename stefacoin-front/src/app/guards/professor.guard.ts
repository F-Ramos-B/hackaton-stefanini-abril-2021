import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, UrlSegment } from '@angular/router';

import { EnumTipoUsuario } from '../enums/enum-tipo-usuario.model';
import { TipoUsuarioGuard } from './tipo-usuario.guard';

@Injectable({
  providedIn: 'root'
})
export class ProfessorGuard extends TipoUsuarioGuard implements CanActivate, CanActivateChild {

  protected verificarTipo(url: UrlSegment[]) {
    const isEdicao = url.some(segment => segment.path.includes('editar'));
    const usuario = this.auth.getUsuario();
    const extras = this.router.getCurrentNavigation().extras?.state;

    if (isEdicao && extras?.tipo) {
      return extras.id && usuario.id === extras.id && EnumTipoUsuario.is.PROFESSOR(usuario.tipo);
    }

    return EnumTipoUsuario.is.PROFESSOR(usuario.tipo);
  }

}
