import express, { NextFunction, Request, Response } from 'express';

import CursoController from '../controllers/curso.controller';
import RoleCheck from '../models/role.model';
import { getDecodedToken } from '../utils/middlewares/auth.middleware';
import { EnumRoles } from './../utils/middlewares/roles.enum';
import BaseRouter from './base.router';

const router = express.Router();

const cursoController = new CursoController();

const getRolesPadraoCursos = (req: Request) => new RoleCheck(
  getDecodedToken(req),
  [EnumRoles.CHECK_TIPO_PROFESSOR]
);

// ----- GET -----

router.get('/curso', async (req: Request, res: Response, next: NextFunction) => {
  BaseRouter.reply(() => cursoController.listarComProfessor(req.body), res, next);
});

router.get('/curso/:id', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  BaseRouter.reply(() => cursoController.obterPorIdComProfessor(Number(id)), res, next);
});

// ----- POST -----

router.post('/curso', async (req: Request, res: Response, next: NextFunction) => {
  BaseRouter.reply(() => cursoController.incluir(req.body), res, next, getRolesPadraoCursos(req));
});

// ----- PUT -----

router.put('/curso/:id', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  BaseRouter.reply(() => cursoController.alterar(Number(id), req.body), res, next, getRolesPadraoCursos(req));
});

router.put('/curso/avaliar/:id', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { nota } = req.query;
  const usuario = getDecodedToken(req);

  const roles: RoleCheck = new RoleCheck(
    usuario,
    [EnumRoles.CHECK_TIPO_ALUNO]
  );

  BaseRouter.reply(() => cursoController.avaliar(Number(id), { nota: Number(nota), idAluno: usuario.id }), res, next, roles);
});

// ----- DELETE -----

router.delete('/curso/:id', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  BaseRouter.reply(() => cursoController.excluir(Number(id)), res, next, getRolesPadraoCursos(req));
});

export default router;
