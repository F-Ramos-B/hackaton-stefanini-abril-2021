import Curso from '../entities/curso.entity';
import Usuario from '../entities/usuario.entity';
import Mapper from '../utils/mapper';
import CursoProfessor from './curso-professor.model';

export default class UsuarioCursos<T extends Usuario> {
  id: number
  nome: string;
  email: string;
  cursos: CursoProfessor[] | Curso[];

  constructor(usuario: T, cursos: CursoProfessor[] | Curso[]) {
    return {
      ...Mapper.copy(usuario, ['senha', 'tipo', 'cursos'] as Array<keyof T>),
      cursos
    };
  };
}
