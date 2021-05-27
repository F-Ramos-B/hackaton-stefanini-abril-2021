import { Injectable, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { Observable } from 'rxjs';

import { AuthService } from './../../services/auth.service';
import { PrivateBaseComponent } from './private-base.component';

@Injectable()
export abstract class CrudBaseComponent<T> extends PrivateBaseComponent implements OnInit {

  public dadosTabela$: Observable<T[]>;

  protected confirmService: ConfirmationService;

  constructor(
    protected injector: Injector
  ) {
    super(injector.get(AuthService), injector.get(Router));
    this.confirmService = this.injector.get(ConfirmationService);
  }

  ngOnInit(): void {
    this.listar();
  }

  protected abstract listar(): void;
  public abstract editar(id: number): void;
  public abstract excluir(entity: T): void;
  protected abstract confirmExcluir(id: number): void;

}
