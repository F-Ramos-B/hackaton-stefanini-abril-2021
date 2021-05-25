import { Injectable } from '@angular/core';

import { Curso } from './../models/curso';
import { CrudService } from './crud.service';


@Injectable({
  providedIn: 'root',
})
export class CursoService extends CrudService<Curso> {

  protected readonly URL: string = 'http://localhost:3000/stefanini/curso';

}
