import { Profile } from "@/entities/Profile";
import { getFullName } from "@/shared/lib/getFullName";
import { AdminUsersFields } from "../model/types/adminSchema";

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
