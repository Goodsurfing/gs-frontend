import { getFullName } from "@/shared/lib/getFullName";
import { AdminOrganizationsFields, AdminUsers, AdminUsersFields } from "../model/types/adminSchema";
import { Host } from "@/entities/Host";

export const adminUsersAdapter = (data?: AdminUsers[]): AdminUsersFields[] => {
    if (!data) return [];
    const result: AdminUsersFields[] = data.map((user) => {
        const {
            id, email, firstName, lastName, created,
            lastVisit, endPayment, isActive, isPayment,
            isSkill, isOrganization,
        } = user;
        return {
            id,
            name: getFullName(firstName, lastName),
            email,
            isBlock: isActive,
            isConfirmed: true,
            isHost: isOrganization,
            isMembership: isPayment,
            isVolunteer: isSkill,
            dateLogin: lastVisit,
            dateRegistration: created,
            dataEndMembership: endPayment,
        };
    });

    return result;
};

export const adminOrganizationsAdapter = (data: Host[]): AdminOrganizationsFields[] => {
    const result: AdminOrganizationsFields[] = data.map((user) => {
        const {
            id, name, owner,
        } = user;
        return {
            id,
            name,
            owner: getFullName(owner.firstName, owner.lastName),
            countMembers: 1,
            countVacancies: 4,
            countVolunteers: 6,
            isBlock: false,
        };
    });

    return result;
};
