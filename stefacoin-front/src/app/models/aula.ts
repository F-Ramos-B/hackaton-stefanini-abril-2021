import { BaseCrudEntity } from './base-crud-entity';

export class Aula extends BaseCrudEntity {
  duracao: number;
  idCurso: number;
  topicos: string[];
}