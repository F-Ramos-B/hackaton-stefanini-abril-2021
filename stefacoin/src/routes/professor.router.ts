import express, { NextFunction, Request, Response } from 'express';

import ProfessorController from '../controllers/professor.controller';
import RoleCheck from '../models/role.model';
import { getDecodedToken } from './../utils/middlewares/auth.middleware';
import { EnumRoles } from './../utils/middlewares/roles.enum';
import BaseRouter from './base.router';

const router = express.Router();

const profController = new ProfessorController();

// ----- GET -----

router.get('/professor', async (req: Request, res: Response, next: NextFunction) => {
  BaseRouter.reply(() => profController.listarComCursos(req.body), res, next);
});

router.get('/professor/:id', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  BaseRouter.reply(() => profController.obterPorIdComCursos(Number(id)), res, next);
});

// ----- POST -----

router.post('/professor', async (req: Request, res: Response, next: NextFunction) => {
  const roles: RoleCheck = new RoleCheck(
    getDecodedToken(req),
    [EnumRoles.CHECK_TIPO_PROFESSOR]
  );

  BaseRouter.reply(() => profController.incluir(req.body), res, next, roles);
});

// ----- PUT -----

router.put('/professor/:id', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const roles: RoleCheck = new RoleCheck(
    getDecodedToken(req),
    [EnumRoles.CHECK_TIPO_PROFESSOR, EnumRoles.CHECK_MESMO_USUARIO(Number(id))]
  );

  console.log(roles);
  

  BaseRouter.reply(() => profController.alterar(Number(id), req.body), res, next, roles);
});

// ----- DELETE -----

router.delete('/professor/:id', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const roles: RoleCheck = new RoleCheck(
    getDecodedToken(req),
    [EnumRoles.CHECK_TIPO_PROFESSOR, EnumRoles.CHECK_USUARIO_DIFERENTE(Number(id))]
  );

  BaseRouter.reply(() => profController.excluir(Number(id)), res, next, roles);
});

export default router;
