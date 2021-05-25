import Usuario from '../../entities/usuario.entity';
import { TipoUsuario } from './../tipo-usuario.enum';

export class EnumRoles {
  static CHECK_TIPO_PROFESSOR = (usuarioReq: Usuario) => new Promise<boolean>(resolve => resolve(usuarioReq.tipo === TipoUsuario.PROFESSOR));
  static CHECK_TIPO_ALUNO = (usuarioReq: Usuario) => new Promise<boolean>(resolve => resolve(usuarioReq.tipo === TipoUsuario.ALUNO));
  static CHECK_TIPO_USUARIO = (tipo: TipoUsuario) => (usuarioReq: Usuario) => new Promise<boolean>(resolve => resolve(usuarioReq.tipo === tipo));
  static CHECK_MESMO_USUARIO = (idUsuarioAlvo: number) => (usuarioReq: Usuario) => new Promise<boolean>(resolve => resolve(usuarioReq.id === idUsuarioAlvo));
  static CHECK_USUARIO_DIFERENTE = (idUsuarioAlvo: number) => (usuarioReq: Usuario) => new Promise<boolean>(resolve => resolve(usuarioReq.id !== idUsuarioAlvo));

  /* 
    static CHECK_MESMO_USUARIO = (idUsuarioAlvo: number) => {
      return (usuarioReq: Usuario) => {
        return new Promise<boolean>(async resolve => {
  
          const usuarioRequisicao = await usuarioRepository.obterPorId(usuarioReq.id);
          const usuarioOperacao = await usuarioRepository.obterPorId(idUsuarioAlvo);
  
          resolve(usuarioReq.id === usuarioOperacao.id && usuarioRequisicao.email === usuarioOperacao.email);
        })
      }
    };
   */

}