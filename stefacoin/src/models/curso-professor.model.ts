import Curso from '../entities/curso.entity';
import Professor from '../entities/professor.entity';
import Mapper from '../utils/mapper';
import Aula from './aula.model';
import Avaliacao from './avaliacao.model';

export default class CursoProfessor {
  id: number;
  nome: string;
  descricao: string;
  professor: Professor;
  aulas: Aula[];
  avaliacoes: Avaliacao[];

  constructor(curso: Curso, professor: Professor) {
    return {
      ...Mapper.copy(curso, ['idProfessor']),
      professor: {
        ...Mapper.copy(professor, ['senha', 'tipo'])
      }
    };
  }
}
