import { RoleInfo } from "../types/profileRoleWidget";
import profileGoodsurfer from "@/shared/assets/icons/profile/profile-goodsurfer.svg";
import profileHost from "@/shared/assets/icons/profile/profile-host.svg";

export const roleData:RoleInfo[] = [
    {
        imageRole: profileGoodsurfer,
        titleRole: "Гудсёрфер",
        descriptionRole: "Чтобы путешествовать как гудсёрфер",
        buttonText: "Стать гудсёрфером",
    },
    {
        imageRole: profileHost,
        titleRole: "Организатор",
        descriptionRole: "Чтобы принимать гудсёрферов как организатор",
        buttonText: "Стать организатором",
    },
];
