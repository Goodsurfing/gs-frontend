import { Profile } from "@/entities/Profile";
import { getFullName } from "@/shared/lib/getFullName";
import { AdminOrganizationsFields, AdminUsersFields } from "../model/types/adminSchema";
import { Host } from "@/entities/Host";

export const adminUsersAdapter = (data: Profile[]): AdminUsersFields[] => {
    const result: AdminUsersFields[] = data.map((user) => {
        const {
            id, email, firstName, lastName, membershipEndDate,
        } = user;
        return {
            id,
            name: getFullName(firstName, lastName),
            email,
            dateEndMembership: membershipEndDate,
            isBlock: false,
            isConfirmed: true,
            isHost: true,
            isMembership: true,
            isVolunteer: false,
            dateLogin: "26.01.2025",
            dateRegistration: "1.01.2025",
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
