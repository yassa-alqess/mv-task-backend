import EmailService from '../../config/mailer';
import Lead from '../../shared/models/lead';
import { ILead, ILeadAddPayload, ILeadsGetPayload, ILeadsGetResponse } from './leads.interface';

export default class LeadsService {
    private _emailService = new EmailService();
    public async addLead(payload: ILeadAddPayload): Promise<ILead> {
        const newLeadLead = await Lead.create({ ...payload });

        // Send an email to the guest
        await this._emailService.sendEmail({
            to: payload.email,
            subject: 'Reaching Lead',
            template: 'reaching-lead',
            context: {
                fullName: payload.fullName,
            }
        });

        const newLeadLeadJson = newLeadLead.toJSON() as ILead;
        return {
            ...newLeadLeadJson,
        }
    }

    public async getLeads(payload: ILeadsGetPayload): Promise<ILeadsGetResponse | undefined> {
        const { limit, offset } = payload;
        const { rows: leads, count: total } = await Lead.findAndCountAll({
            limit,
            offset,
        });
        return {
            leads,
            total,
            pages: Math.ceil(total / limit),
        };
    }
}