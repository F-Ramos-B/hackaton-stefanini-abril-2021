import { Injectable, Injector } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Mensagem from 'src/app/models/mensagem';

import { AuthService } from '../../services/auth.service';
import { PrivateBaseComponent } from './private-base.component';

@Injectable()
export abstract class InclusaoBaseComponent extends PrivateBaseComponent {

  public idEdicao: number;
  public abstract formulario: FormGroup;

  constructor(
    protected injector: Injector
  ) {
    super(injector.get(AuthService), injector.get(Router));
    this.idEdicao = this.navigationParams?.id;
  }

  public abstract validate(): void;
  protected abstract cadastrar(): void;
  protected abstract editar(): void;
  public abstract voltar(): void;

  protected confirmarOperacao(resposta: Mensagem): void {
    this.toastSucesso(resposta.mensagem);
    this.voltar();
  }

}
