
import { Router } from 'express';
import AuthController from './auth/auth.controller';
import WarmController from './leads/leads.controller';

const restRouter = Router();
for (const controller of [
    AuthController,
    WarmController,
]) {
    const instance = new controller();
    restRouter.use('/', instance.router);
}

export default restRouter;