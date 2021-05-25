import { BaseCrudEntity } from './base-crud-entity';
import { Curso } from './curso';

export class Usuario extends BaseCrudEntity {
  email?: string;
  tipo?: number;
  cursos?: Curso[];

}
