import Usuario from '../entities/usuario.entity';

export default class RoleCheck {
  usuario: Usuario;
  predicates: ((usuarioReq: Usuario) => Promise<boolean>)[];
  and: boolean; // or / some (se basta satisfazer apenas 1 predicate para aceitar a operação pelo token do usuário)

  constructor(usuario: Usuario, predicates: ((usuarioReq: Usuario) => Promise<boolean>)[], and: boolean = true) {
    this.usuario = usuario;
    this.predicates = predicates;
    this.and = and;
  }
}
