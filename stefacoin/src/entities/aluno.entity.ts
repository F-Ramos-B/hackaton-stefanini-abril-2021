import Mapper from '../utils/mapper';
import Usuario from './usuario.entity';

export default class Aluno extends Usuario {
  idade: number;
  formacao: string;
  cursos?: number[];

  constructor() {
    super();
  }

  static include(aluno: Aluno): Aluno {
    return {
      ...super.include(aluno),
      ...Mapper.pick(aluno, ['idade', 'formacao']),
      cursos: []
    } as Aluno;
  }
}
