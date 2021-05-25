import { BaseCrudEntity } from './base-crud-entity';
import { Professor } from 'src/app/models/professor';
import { Aula } from "./aula";
import Avaliacao from "./avaliacao";

export class Curso extends BaseCrudEntity {
  descricao?: string;
  professor?: Professor;
  aulas?: Aula[];
  avaliacoes?: Avaliacao[];
  idProfessor?: number;
}
