import { UsuarioToken } from './usuario-token';

export interface Login {
  usuario: Partial<UsuarioToken>;
  token: string;
  expires: number;
}
