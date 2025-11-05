export interface Admin {
    token: string,
}

export interface AdminSchema {
    authData?: Admin,
}

export interface AdminUsersFields {
    id: string;
    email?: string;
    name?: string;
    dateRegistration?: string;
    dateLogin?: string;
    isConfirmed: boolean;
    isVolunteer: boolean;
    isHost: boolean;
    isBlock: boolean;
    isMembership: boolean;
    dateEndMembership: string;
}

export interface AdminOrganizationsFields {
    id: string;
    name?: string;
    owner: string;
    countMembers: number;
    countVacancies: number;
    countVolunteers: number;
}
