import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import Mensagem from '../models/mensagem';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export abstract class CrudService<T> extends BaseService {

  protected readonly URL: string = 'http://localhost:3000/stefanini/';

  // #pegabandeira
  buscarPorId(id: number): Observable<T> {
    return this.takeFilter(this.http.get<T>(`${this.URL}/${id}`));
  }

  // #pegabandeira
  listar(filtro: Partial<T> = {}): Observable<T[]> {
    return this.http.get<T[]>(this.URL, {
      params: filtro as any
    });
  }

  incluir(entity: T): Observable<Mensagem> {
    return this.takeFilter(this.http.post<Mensagem>(this.URL, entity));
  }

  editar(id: number, entity: T): Observable<Mensagem> {
    return this.takeFilter(this.http.put<Mensagem>(`${this.URL}/${id}`, entity));
  }

  excluir(id: number): Observable<Mensagem> {
    return this.takeFilter(this.http.delete<Mensagem>(`${this.URL}/${id}`));
  }


}
