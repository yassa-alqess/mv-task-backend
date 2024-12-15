// file dependencies
import { AUTH_PATH } from '../../shared/constants';
import { Controller } from '../../shared/interfaces/controller.interface';
import { validate } from '../../shared/middlewares';
import AuthService from './auth.service';
import logger from '../../config/logger';
import { LoginSchema, RefreshTokenSchema } from './auth.dto';
import { InternalServerException, NotFoundException, WrongCredentialsException } from '../../shared/exceptions';

// 3rd party dependencies
import express, { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

export default class AuthController implements Controller {
    path = `/${AUTH_PATH}`;
    router = express.Router();
    private _authService = new AuthService();
    constructor() {
        this._initializeRoutes();
    }

    private _initializeRoutes() {
        this.router.post(`${this.path}/login`, validate(LoginSchema), this.login);
        this.router.post(`${this.path}/refresh-token`, validate(RefreshTokenSchema), this.refreshToken);
    }
    public login = async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body;
        try {
            const tokens = await this._authService.login(email, password);
            res.status(StatusCodes.OK).json({
                accessToken: tokens[0],
                refreshToken: tokens[1],
                type: 'Bearer',
            }).end();

            //eslint-disable-next-line
        } catch (error: any) {
            logger.error(`error at login action ${error.message}`);
            if (error instanceof NotFoundException || error instanceof WrongCredentialsException) {
                return next(error);
            }
            next(new InternalServerException(error.message));
        }
    }

    public refreshToken = async (req: Request, res: Response, next: NextFunction) => {
        const { refreshToken } = req.body;
        try {
            const tokens = await this._authService.refreshToken(refreshToken);
            res.status(StatusCodes.OK).json({
                accessToken: tokens[0],
                refreshToken: tokens[1],
                type: 'Bearer',
            }).end();
            //eslint-disable-next-line
        } catch (error: any) {
            logger.error(`error at refreshToken action ${error.message}`);
            next(new InternalServerException(`${error.message}`));
        }
    }
}