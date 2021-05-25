import { Injectable } from '@angular/core';

import { Professor } from '../models/professor';
import { CrudService } from './crud.service';

@Injectable({
  providedIn: 'root',
})
export class ProfessorService extends CrudService<Professor> {

  protected readonly URL: string = 'http://localhost:3000/stefanini/professor';

}
