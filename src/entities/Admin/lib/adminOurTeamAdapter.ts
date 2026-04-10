import { getFullName } from "@/shared/lib/getFullName";
import {
    CreateAdminOurTeam, GetAdminOurTeam, GetAdminOurTeams, OurTeamFields,
} from "../model/types/adminOurTeam";

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

export const adminOurTeamApiAdapter = (data: OurTeamFields): CreateAdminOurTeam => {
    const {
        firstName, lastName, position, isFounder, sort,
        image, vkontakte, telegram, userId,
    } = data;
    return {
        firstName,
        lastName,
        position,
        isFounder,
        sort,
        imageId: image.id,
        vkontakte,
        telegram,
        userId,
    };
};

export const adminOurTeamPersonalAdapter = (data: GetAdminOurTeam): OurTeamFields => {
    const {
        firstName, lastName, position, isFounder, sort,
        image, vkontakte, telegram, userId,
    } = data;
    return {
        firstName,
        lastName,
        position,
        isFounder,
        sort,
        image,
        vkontakte,
        telegram,
        userId,
    };
};
