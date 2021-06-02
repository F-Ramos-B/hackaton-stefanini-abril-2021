import { NextFunction, Response } from 'express';

import RoleCheck from '../models/role.model';
import UnauthorizedException from '../utils/exceptions/unauthorized.exception';

export default class BaseRouter {
  /**
   * Método usado por todos os routers que encapsula as funções das controllers em um try catch, tratando sucesso e erro em um único lugar.
   * @param action Função de alguma controller que será executada dentro do escopo do try catch. O retorno dela será devolvido como JSON em res.json().
   * @param res Objeto response.
   * @param next Objeto next.
   * @param roleCheck Objeto opcional com dados de permissão pra tal operação que serão checadas com o token do usuário que fez a requisição.
   */
  static async reply<T>(action: () => Promise<T>, res: Response, next: NextFunction, roleCheck?: RoleCheck) {
    try {
      if (roleCheck) {
        await this.verificarRoles(roleCheck);
      }
      res.json(await action());
    }
    catch (e) {
      console.table(e);
      console.error(e);
      next(e);
    }
  }

  private static async verificarRoles(roleCheck: RoleCheck) {
    const promises: Promise<boolean>[] = roleCheck.predicates.map(async predicate => await predicate(roleCheck.usuario));
    const results: boolean[] = await Promise.all(promises);

    if ((roleCheck.and && results.includes(false)) || (!roleCheck.and && !results.includes(true))) {
      throw new UnauthorizedException('Usuário não possui permissão para essa operação.');
    }
  }
}