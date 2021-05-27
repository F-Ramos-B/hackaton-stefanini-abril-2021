import express, { NextFunction, Request, Response } from 'express';

import AlunoController from '../controllers/aluno.controller';
import RoleCheck from '../models/role.model';
import { getDecodedToken } from './../utils/middlewares/auth.middleware';
import { EnumRoles } from './../utils/middlewares/roles.enum';
import BaseRouter from './base.router';

const router = express.Router();

const alunoController = new AlunoController();

// ----- GET -----

router.get('/aluno', async (req: Request, res: Response, next: NextFunction) => {
  BaseRouter.reply(() => alunoController.listarComCursos(req.body), res, next);
});

router.get('/aluno/:id', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  BaseRouter.reply(() => alunoController.obterPorIdComCursos(Number(id)), res, next);
});

// ----- POST -----

router.post('/aluno', async (req: Request, res: Response, next: NextFunction) => {
  const roles: RoleCheck = new RoleCheck(
    getDecodedToken(req),
    [EnumRoles.CHECK_TIPO_PROFESSOR]
  );

  BaseRouter.reply(() => alunoController.incluir(req.body), res, next, roles);
});

// ----- PUT -----

router.put('/aluno/:id', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const roles: RoleCheck = new RoleCheck(
    getDecodedToken(req),
    [EnumRoles.CHECK_TIPO_PROFESSOR, EnumRoles.CHECK_MESMO_USUARIO(Number(id))],
    false
  );

  BaseRouter.reply(() => alunoController.alterar(Number(id), req.body), res, next, roles);
});

router.put('/aluno/matricular/:idCurso', async (req: Request, res: Response, next: NextFunction) => {
  const { idCurso } = req.params;
  const usuarioRequisicao = getDecodedToken(req);

  const roles: RoleCheck = new RoleCheck(
    usuarioRequisicao,
    [EnumRoles.CHECK_TIPO_ALUNO]
  );

  BaseRouter.reply(() => alunoController.matricular(Number(idCurso), usuarioRequisicao.id), res, next, roles);
});

router.put('/aluno/desmatricular/:idCurso', async (req: Request, res: Response, next: NextFunction) => {
  const { idCurso } = req.params;
  const usuarioRequisicao = getDecodedToken(req);

  const roles: RoleCheck = new RoleCheck(
    usuarioRequisicao,
    [EnumRoles.CHECK_TIPO_ALUNO]
  );

  BaseRouter.reply(() => alunoController.desmatricular(Number(idCurso), usuarioRequisicao.id), res, next, roles);
});

// ----- DELETE -----

router.delete('/aluno/:id', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const roles: RoleCheck = new RoleCheck(
    getDecodedToken(req),
    [EnumRoles.CHECK_TIPO_PROFESSOR]
  );

  BaseRouter.reply(() => alunoController.excluir(Number(id)), res, next, roles);
});

export default router;
