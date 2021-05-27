import { ToastService } from './../../services/toast.service';
import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export abstract class BaseComponent implements OnDestroy {

  protected ngUnsubscribe$ = new Subject();

  protected toastSucesso(detail: string) {
    ToastService.instance.sucesso(detail);
  }

  protected toastAviso(detail: string) {
    ToastService.instance.aviso(detail);
  }

  protected toastErro(detail: string) {
    ToastService.instance.erro(detail);
  }

  protected toastMensagem(summary: string, detail: string, severity: string) {
    ToastService.instance.mensagem(summary, detail, severity);
  }

  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

}
