import { Professor } from 'src/app/models/professor';

import { Aula } from './aula';
import { BaseCrudEntity } from './base-crud-entity';

export class CursoForm extends BaseCrudEntity {
  descricao?: string;
  professor?: Professor;
  aulas?: Aula[];
}
