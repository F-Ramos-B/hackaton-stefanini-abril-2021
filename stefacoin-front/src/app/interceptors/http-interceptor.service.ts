import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import HttpErrorMensagem from '../models/http-erro';
import MensagemErro from '../models/mensagem-erro';
import { AuthService } from '../services/auth.service';
import { ToastService } from './../services/toast.service';

@Injectable({
  providedIn: 'root',
})
export class HttpInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({
      setHeaders: {
        authorization: this.authService.getToken(),
      }
    });

    return next.handle(req).pipe(
      // Exibir toast automaticamente em caso de erro
      catchError((err: HttpErrorMensagem<MensagemErro>) => {
        const mensagem = err?.error?.message || err?.message || 'Erro desconhecido';
        ToastService.getInstance().erro(mensagem);
        return throwError(err);
      }));
  }
}
