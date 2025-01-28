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
            title: "Регистрация",
            text: "Бесплатно зарегистрируйтесь и заполните свой профиль",
            image: image1,
        },
        {
            title: "Выбор программы",
            text: "Выберите, куда вы хотите поехать и чем заняться",
            image: image2,
        },
        {
            title: "Заявка",
            text: "Отправьте заявку принимающей стороне о вашем участии",
            image: image3,
        },
        {
            title: "Подтверждение",
            text: "Получаете подтверждение и обсуждаете подробности",
            image: image4,
        },
        {
            title: "Путешествие",
            text: "Получайте удовольствие от нового места и общения",
            image: image5,
        },
    ];

    const translatedData = howItWorkData.map((item) => ({
        ...item,
        title: t(item.title),
        text: t(item.text),
    }));

    return translatedData;
};
