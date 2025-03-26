import { useTranslation } from "react-i18next";
import profileGoodsurfer from "@/shared/assets/icons/profile/profile-goodsurfer.svg";
import profileHost from "@/shared/assets/icons/profile/profile-host.svg";

import { RoleInfo } from "../types/profileRoleWidget";

export const useRoleData = () => {
    const { t } = useTranslation("profile");

    const roleData: RoleInfo[] = [
        {
            id: "volunteer",
            imageRole: profileGoodsurfer,
            titleRole: t("role.Гудсёрфер"),
            descriptionRole: t("role.Чтобы путешествовать как гудсёрфер"),
            buttonText: t("role.Стать гудсёрфером"),
            disabledButtonText: t("role.Вы уже стали гудсёрфером"),
        },
        {
            id: "host",
            imageRole: profileHost,
            titleRole: t("role.Организатор"),
            descriptionRole: t("role.Чтобы принимать гудсёрферов как организатор"),
            buttonText: t("role.Стать организатором"),
            disabledButtonText: t("role.Вы уже стали организатором"),
        },
    ];

    return { roleData };
};
