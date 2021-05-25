import { Injectable, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { Observable } from 'rxjs';

import { EnumTipoUsuario } from '../../enums/enum-tipo-usuario.model';
import { UsuarioToken } from '../../models/usuario-token';
import { AuthService } from '../../services/auth.service';
import { BaseComponent } from './base.component';

@Injectable()
export abstract class CrudBaseComponent<T> extends BaseComponent implements OnInit {

  usuario: UsuarioToken;
  isProfessor: boolean;

  dadosTabela$: Observable<T[]>;

  protected authService: AuthService;
  protected router: Router;
  protected confirmService: ConfirmationService;

  constructor(
    protected injector: Injector
  ) {
    super();
    this.authService = this.injector.get(AuthService);
    this.router = this.injector.get(Router);
    this.confirmService = this.injector.get(ConfirmationService);
  }

  ngOnInit(): void {
    this.usuario = this.authService.getUsuario();
    this.isProfessor = EnumTipoUsuario.is.PROFESSOR(this.usuario?.tipo);
    this.listar();
  }

  protected abstract listar(): void;
  protected abstract editar(id: number): void;
  protected abstract excluir(entity: T): void;
  protected abstract confirmExcluir(id: number): void;

}
