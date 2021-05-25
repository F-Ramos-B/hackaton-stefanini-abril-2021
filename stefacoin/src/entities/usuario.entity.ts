import Mapper from '../utils/mapper';
import Entity from './entity';

export default class Usuario extends Entity {
  email: string;
  senha: string;
  nome: string;

  tipo: number; // 1 - Professor    2 - Aluno

  constructor() {
    super();
  }

  static include(usuario: Usuario): Usuario {
    return Mapper.pick(usuario, ['nome', 'email', 'senha', 'tipo']) as Usuario;
  }

}
