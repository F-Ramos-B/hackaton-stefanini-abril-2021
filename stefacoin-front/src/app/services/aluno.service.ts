import { Injectable } from '@angular/core';

import { Aluno } from './../models/aluno';
import { CrudService } from './crud.service';


@Injectable({
  providedIn: 'root',
})
export class AlunoService extends CrudService<Aluno> {

  protected readonly URL: string = 'http://localhost:3000/stefanini/aluno';

}
