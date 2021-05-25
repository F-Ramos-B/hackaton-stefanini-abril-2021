import Aluno from '../entities/aluno.entity';
import Professor from '../entities/professor.entity';
import Usuario from '../entities/usuario.entity';
import UsuarioCursos from '../models/user-cursos.model';
import usuarioRepository from '../repositories/usuario.repository';
import { FilterQuery } from '../utils/database/database';
import BusinessException from '../utils/exceptions/business.exception';
import { TipoUsuario } from './../utils/tipo-usuario.enum';
import { Validador } from './../utils/utils';

export default class UsuarioController {
  async obterPorId(id: number): Promise<Usuario> {
    return await usuarioRepository.obterPorId(id, true);
  }

  async obterPorIdTipo<T extends Usuario>(id: number): Promise<UsuarioCursos<T>> {
    Validador.validarParametros([{ id }]);
    const usuario = await this.obterPorId(id);
    return TipoUsuario.PROFESSOR === usuario.tipo ? new UsuarioCursos<Professor>(usuario, []) : new UsuarioCursos<Aluno>(usuario as Aluno, []);
  }

  async obter(filtro: FilterQuery<Usuario> = {}): Promise<Usuario> {
    return await usuarioRepository.obter(filtro);
  }

  async listar(filtro: FilterQuery<Usuario> = {}): Promise<Usuario[]> {
    return await usuarioRepository.listar(filtro);
  }

  static async validarEmail(email: string) {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (!emailRegex.test(email)) {
      throw new BusinessException('Email inválido.');
    } else if (await usuarioRepository.obter({ email: { $eq: email } })) {
      throw new BusinessException('Este e-mail já está em uso.');
    }
  }

}
