import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/components/shared/base.component';

import { EnumTipoUsuario } from './../../enums/enum-tipo-usuario.model';
import { UsuarioToken } from './../../models/usuario-token';
import { AuthService } from './../../services/auth.service';

@Injectable()
export abstract class PrivateBaseComponent extends BaseComponent implements OnDestroy {

  usuario: UsuarioToken;
  isProfessor: boolean;
  navigationParams: any;

  constructor(
    protected authService: AuthService,
    protected router: Router
  ) {
    super();
    this.usuario = this.authService.getUsuario();
    this.isProfessor = EnumTipoUsuario.is.PROFESSOR(this.usuario?.tipo);
    this.navigationParams = this.router.getCurrentNavigation()?.extras?.state;
  }

}
