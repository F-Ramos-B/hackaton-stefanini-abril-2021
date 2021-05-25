import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastService {

  private readonly TEMPO_TOAST_MS = 5000;

  public static instance: ToastService;

  constructor(private messageService: MessageService) {
    ToastService.instance = this;
  }

  init() {
    console.log('iniciando toast service');
  }

  sucesso(detail: string) {
    this.messageService.add({ life: this.TEMPO_TOAST_MS, severity: 'success', summary: 'Sucesso', detail });
  }

  aviso(detail: string) {
    this.messageService.add({ life: this.TEMPO_TOAST_MS, severity: 'warn', summary: 'Aviso', detail });
  }

  erro(detail: string) {
    this.messageService.add({ life: this.TEMPO_TOAST_MS, severity: 'error', summary: 'Erro', detail });
  }

  mensagem(summary: string, detail: string, severity: string) {
    this.messageService.add({ severity, summary, detail });
  }

}
