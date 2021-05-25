import Usuario from '../entities/usuario.entity';

export default class Login {
  usuario: Partial<Usuario>;
  token: string;
  expiresSeconds: number;
  expires: number;

  constructor() {}
}
