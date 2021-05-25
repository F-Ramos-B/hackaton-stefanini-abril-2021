import express, { NextFunction, Request, Response } from 'express';

import CadastroController from '../controllers/cadastro.controller';
import BaseRouter from './base.router';

const router = express.Router();

const cadastroController = new CadastroController();

router.post('/cadastrar', async (req: Request, res: Response, next: NextFunction) => {
  BaseRouter.reply(() => cadastroController.cadastrar(req.body), res, next);
});

export default router;
