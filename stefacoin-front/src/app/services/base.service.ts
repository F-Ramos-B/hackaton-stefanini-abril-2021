import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take, filter } from 'rxjs/operators';

import { StefacoinUtils } from '../utils/utils';

@Injectable({
  providedIn: 'root',
})
export abstract class BaseService {

  constructor(protected http: HttpClient) { }

  private readonly PIPE_AMOUNT = 1;

  protected takeFilter<T>(observable: Observable<T>): Observable<T> {
    return observable.pipe(take(this.PIPE_AMOUNT));
  }

  protected construirQueryParams<T extends object>(params: Exclude<T, any[]>, httpParams: HttpParams = new HttpParams()): HttpParams {
    Object.keys(params).forEach(chave => {
      const valor = params[chave];

      if (StefacoinUtils.isObject(valor)) {
        httpParams = this.construirQueryParams(valor, httpParams);
      } else if (StefacoinUtils.isListaPreenchida(valor)) {
        valor.filter((item: any) => StefacoinUtils.isStringOrNumber(item)).forEach((item: any) => httpParams = httpParams.append(chave, item));
      } else if (StefacoinUtils.isStringOrNumber(valor)) {
        httpParams = httpParams.append(chave, valor.toString().trim());
      }
    });

    return httpParams;
  }

}
