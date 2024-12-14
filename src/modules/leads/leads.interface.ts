export interface ILeadAddPayload {
    fullName: string;
    email: string;
    phone: string;
    nid: string;
}

export interface ILeadsGetResponse {
    leads: ILead[];
    total: number;
    pages: number;
}

export interface ILeadsGetPayload {
    limit: number;
    offset: number;
}

export interface ILead {
    leadId: string;
    fullName: string;
    email: string;
    phone: string;
    nid: string;
}