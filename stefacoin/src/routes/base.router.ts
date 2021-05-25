import { NextFunction, Response } from 'express';

import RoleCheck from '../models/role.model';
import UnauthorizedException from '../utils/exceptions/unauthorized.exception';

export default class BaseRouter {
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