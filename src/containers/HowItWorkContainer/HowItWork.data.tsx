import { useTranslation } from "react-i18next";
import image1 from "@/shared/assets/images/how-it-work/img1.png";
import image2 from "@/shared/assets/images/how-it-work/img2.png";
import image3 from "@/shared/assets/images/how-it-work/img3.png";
import image4 from "@/shared/assets/images/how-it-work/img4.png";
import image5 from "@/shared/assets/images/how-it-work/img5.png";

export const useHowItWorkData = () => {
    const { t } = useTranslation("main");

    const howItWorkData = [
        {
            title: t("Регистрация"),
            text: t("Бесплатно зарегистрируйтесь и заполните свой профиль"),
            image: image1,
        },
        {
            title: t("Выбор программы"),
            text: t("Выберите, куда вы хотите поехать и чем заняться"),
            image: image2,
        },
        {
            title: t("Заявка"),
            text: t("Отправьте заявку принимающей стороне о вашем участии"),
            image: image3,
        },
        {
            title: t("Подтверждение"),
            text: t("Получаете подтверждение и обсуждаете подробности"),
            image: image4,
        },
        {
            title: t("Путешествие"),
            text: t("Получайте удовольствие от нового места и общения"),
            image: image5,
        },
    ];

    return howItWorkData;
};
