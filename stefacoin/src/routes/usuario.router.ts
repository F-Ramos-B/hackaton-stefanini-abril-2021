import express, { NextFunction, Request, Response } from 'express';

import UsuarioController from '../controllers/usuario.controller';
import BaseRouter from './base.router';

const router = express.Router();

const usuarioController = new UsuarioController();

router.get('/usuario/:id', async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  BaseRouter.reply(() => usuarioController.obterPorIdTipo(Number(id)), res, next);
});

export default router;
