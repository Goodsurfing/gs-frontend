import { getFullName } from "@/shared/lib/getFullName";
import { GetAdminOurTeams } from "../model/types/adminOurTeam";

export const adminOurTeamAdapter = (data: GetAdminOurTeams[]) => {
    const result = data.map((item) => {
        const {
            id, firstName, lastName, position, isFounder, sort,
        } = item;
        return {
            id,
            name: getFullName(firstName, lastName),
            position,
            isFounder,
            sort,
        };
    });
    return result;
};
