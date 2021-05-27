import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import Mensagem from '../models/mensagem';
import { Aluno } from './../models/aluno';
import { CrudService } from './crud.service';


@Injectable({
  providedIn: 'root',
})
export class AlunoService extends CrudService<Aluno> {

  protected readonly URL: string = 'http://localhost:3000/stefanini/aluno';

  matricular(idCurso: number): Observable<Mensagem> {
    return this.takeFilter(this.http.put<Mensagem>(`${this.URL}/matricular/${idCurso}`, null));
  }

  desmatricular(idCurso: number): Observable<Mensagem> {
    return this.takeFilter(this.http.put<Mensagem>(`${this.URL}/desmatricular/${idCurso}`, null));
  }

}
