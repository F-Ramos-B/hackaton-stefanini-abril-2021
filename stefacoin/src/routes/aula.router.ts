import { EnumRoles } from './../utils/middlewares/roles.enum';
import express, { NextFunction, Request, Response } from 'express';

import AulaController from '../controllers/aula.controller';
import RoleCheck from '../models/role.model';
import { getDecodedToken } from '../utils/middlewares/auth.middleware';
import BaseRouter from './base.router';

const router = express.Router();

const aulaController = new AulaController();

const getRolesPadraoAulas = (req: Request) => new RoleCheck(
  getDecodedToken(req),
  [EnumRoles.CHECK_TIPO_PROFESSOR]
);

// ----- GET -----

router.get('/aula', async (req: Request, res: Response, next: NextFunction) => {
  const { idCurso } = req.query;
  const action = idCurso ? () => aulaController.listar(Number(idCurso)) : () => aulaController.listarTodasAulas();

  BaseRouter.reply(action, res, next);
});

router.get('/aula/:id', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { idCurso } = req.query;
  BaseRouter.reply(() => aulaController.obterPorId(Number(id), Number(idCurso)), res, next);
});

// ----- POST -----

router.post('/aula', async (req: Request, res: Response, next: NextFunction) => {
  BaseRouter.reply(() => aulaController.incluir(req.body), res, next, getRolesPadraoAulas(req));
});

// ----- PUT -----

router.put('/aula/:id', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  BaseRouter.reply(() => aulaController.alterar(Number(id), req.body), res, next, getRolesPadraoAulas(req));
});

// ----- DELETE -----

router.delete('/aula/:id', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { idCurso } = req.query;
  
  BaseRouter.reply(() => aulaController.excluir(Number(id), Number(idCurso)), res, next, getRolesPadraoAulas(req));
});

export default router;
