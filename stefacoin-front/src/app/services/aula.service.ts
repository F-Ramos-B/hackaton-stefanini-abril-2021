import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import Mensagem from '../models/mensagem';
import { BaseService } from './base.service';


@Injectable({
  providedIn: 'root',
})
export class AulaService extends BaseService {

  protected readonly URL: string = 'http://localhost:3000/stefanini/aula';

  excluir(idAula: number, idCurso: number): Observable<Mensagem> {
    const params: HttpParams = this.construirQueryParams({ idCurso });
    return this.takeFilter(this.http.delete<Mensagem>(`${this.URL}/${idAula}`, { params }));
  }

}
