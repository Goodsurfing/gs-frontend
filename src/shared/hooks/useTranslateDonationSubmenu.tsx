import { useTranslation } from "react-i18next";

export const useTranslateDonationSubmenu = () => {
    const { t } = useTranslation("donation");

    const SubmenuItemsDonation = [
        {
            text: t("donationPersonal.Описание", "Описание"),
            id: "description",
        },
        {
            text: t("donationPersonal.Местоположение", "Местоположение"),
            id: "address",
        },
        {
            text: t("donationPersonal.Фотографии", "Фотографии"),
            id: "gallery",
        },
        {
            text: t("donationPersonal.Организация", "Организация"),
            id: "organization",
        },
        {
            text: t("donationPersonal.Участники", "Участники"),
            id: "participants",
        },
    ];

    return { SubmenuItemsDonation };
};
