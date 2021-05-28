import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import { Curso } from './../models/curso';
import { CrudService } from './crud.service';
import Mensagem from '../models/mensagem';


@Injectable({
  providedIn: 'root',
})
export class CursoService extends CrudService<Curso> {

  protected readonly URL: string = 'http://localhost:3000/stefanini/curso';

  avaliar(idCurso: number, nota: number): Observable<Mensagem> {
    const params: HttpParams = this.construirQueryParams({ nota });
    return this.takeFilter(this.http.put<Mensagem>(`${this.URL}/avaliar/${idCurso}`, null, { params }));
  }

}
