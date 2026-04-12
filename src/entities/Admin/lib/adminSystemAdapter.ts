import { getFullName } from "@/shared/lib/getFullName";
import { GetAdminSystemList } from "../model/types/adminSystemSchema";

export const adminSystemAdminAdapter = (data: GetAdminSystemList[]) => data.map((item) => {
    const {
        id, firstName, lastName, email,
    } = item;

    return {
        id,
        name: getFullName(firstName, lastName),
        email,
    };
});
