import LeadsService from './leads.service'; // Adjust the import according to your project structure
import { ILeadAddPayload, ILeadsGetPayload } from './leads.interface'; // Adjust the import according to your project structure
import { accessTokenGuard, requireAnyOfThoseRoles } from '../../shared/middlewares';
import { RoleEnum } from '../../shared/enums';
import { Controller } from '../../shared/interfaces';
import { LEADS_PATH } from '../../shared/constants';
import { InternalServerException } from '../../shared/exceptions';

// 3rd party dependencies
import express, { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export default class LeadsController implements Controller {
    private _leadsService = new LeadsService();
    router = express.Router();
    path = `/${LEADS_PATH}`;

    constructor() {
        this._initializeRoutes();
    }

    private _initializeRoutes() {
        this.router.post(`${this.path}`, this.addLead);
        this.router.get(
            `${this.path}`,
            accessTokenGuard,
            requireAnyOfThoseRoles([RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN]),
            this.getLeads
        );
    }

    public addLead = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const payload: ILeadAddPayload = req.body;
            const newLead = await this._leadsService?.addLead(payload);
            res.status(StatusCodes.CREATED).json(newLead);

            //eslint-disable-next-line
        } catch (error: any) {
            next(new InternalServerException(error.message));
        }
    }

    public getLeads = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { limit = 10, page = 1 } = req.query;
            const payload: ILeadsGetPayload = {
                limit: parseInt(limit as string),
                offset: (parseInt(page as string) - 1) * parseInt(limit as string)
            };
            const leads = await this._leadsService?.getLeads(payload);
            res.status(StatusCodes.OK).json(leads);

            //eslint-disable-next-line
        } catch (error: any) {
            next(new InternalServerException(error.message));
        }
    }
}