import { getTime } from 'date-fns';
import jwt from 'jsonwebtoken';

import Usuario from '../entities/usuario.entity';
import Login from '../models/login.model';
import UsuarioRepository from '../repositories/usuario.repository';
import config from '../utils/config/config';
import UnauthorizedException from '../utils/exceptions/unauthorized.exception';
import { Validador } from '../utils/utils';

export default class AlunoController {
  async login(crendeciais: Usuario): Promise<Login> {
    const { email, senha } = crendeciais;

    Validador.validarParametros([{ email }, { senha }]);
    const usuario = await UsuarioRepository.obter({ email });

    // #pegabandeira
    if (!usuario) {
      throw new UnauthorizedException('Email ou senha inválido');
    }

    Validador.validarSenha(senha, usuario.senha);

    const accessToken = jwt.sign({ id: usuario.id, email: usuario.email, tipo: usuario.tipo }, config.auth.secret, {
      expiresIn: config.auth.expiresIn,
    });

    return {
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
        tipo: usuario.tipo,
      },
      token: accessToken,
      expiresSeconds: this.calcSeconds(config.auth.expiresIn),
      expires: getTime(Date.now() / 1000) + 604800,
    };
  }

  private calcSeconds(amount: string): number {
    const regexDias = /([1-9]+)([d])/;
    
    if (!regexDias.test(amount)) {
      return null;
    }

    const regexResult = regexDias.exec(amount)[1];

    return Number(regexResult) * 86400;
  }
}
