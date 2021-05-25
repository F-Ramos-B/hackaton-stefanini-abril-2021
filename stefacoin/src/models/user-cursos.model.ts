import Curso from '../entities/curso.entity';
import Usuario from '../entities/usuario.entity';
import Mapper from '../utils/mapper';

export default class UsuarioCursos<T extends Usuario> {
  id: number
  nome: string;
  email: string;
  cursos: Curso[];

  constructor(usuario: T, cursos: Curso[]) {
    return {
      ...Mapper.copy(usuario, ['senha', 'tipo', 'cursos'] as Array<keyof T>),
      cursos
    };
  };
}
