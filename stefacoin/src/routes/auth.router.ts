import express, { NextFunction, Request, Response } from 'express';

import AuthController from '../controllers/auth.controller';
import BaseRouter from './base.router';

const router = express.Router();

const authController = new AuthController();

router.post('/auth', async (req: Request, res: Response, next: NextFunction) => {
  BaseRouter.reply(() => authController.login(req.body), res, next);
});

export default router;
