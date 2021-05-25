import Aula from '../models/aula.model';
import Avaliacao from '../models/avaliacao.model';
import Mapper from '../utils/mapper';
import Entity from './entity';

export default class Curso extends Entity {
  nome: string;
  descricao: string;
  idProfessor?: number;
  aulas?: Aula[];
  avaliacoes?: Avaliacao[];

  constructor() {
    super();
  }

  static include(curso: Curso): Curso {
    return {
      ...Mapper.pick(curso, ['nome', 'descricao', 'idProfessor', 'aulas']),
      avaliacoes: []
    } as Curso;
  }
}
