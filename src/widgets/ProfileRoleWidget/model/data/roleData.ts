import profileGoodsurfer from "@/shared/assets/icons/profile/profile-goodsurfer.svg";
import profileHost from "@/shared/assets/icons/profile/profile-host.svg";

import { RoleInfo } from "../types/profileRoleWidget";

export const roleData: RoleInfo[] = [
    {
        id: "volunteer",
        imageRole: profileGoodsurfer,
        titleRole: "Гудсёрфер",
        descriptionRole: "Чтобы путешествовать как гудсёрфер",
        buttonText: "Стать гудсёрфером",
    },
    {
        id: "host",
        imageRole: profileHost,
        titleRole: "Организатор",
        descriptionRole: "Чтобы принимать гудсёрферов как организатор",
        buttonText: "Стать организатором",
    },
];
