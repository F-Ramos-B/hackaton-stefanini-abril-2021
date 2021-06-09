import { ToastService } from './../../services/toast.service';
import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export abstract class BaseComponent implements OnDestroy {

  protected ngUnsubscribe$ = new Subject();

  protected toastSucesso(detail: string) {
    ToastService.getInstance().sucesso(detail);
  }

  protected toastAviso(detail: string) {
    ToastService.getInstance().aviso(detail);
  }

  protected toastErro(detail: string) {
    ToastService.getInstance().erro(detail);
  }

  protected toastMensagem(summary: string, detail: string, severity: string) {
    ToastService.getInstance().mensagem(summary, detail, severity);
  }

  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

}
