import { useTranslation } from "react-i18next";
import benefitImage1 from "@/shared/assets/images/benefits/benefit1.png";
import benefitImage2 from "@/shared/assets/images/benefits/benefit2.png";
import benefitImage3 from "@/shared/assets/images/benefits/benefit3.png";

export const useBenefitsData = () => {
    const { t } = useTranslation("main");

    const benefitsData = [
        {
            title: "Бесплатно",
            text: "Вам не нужно платить ни за регистрацию, ни за общение с принимающей стороной. Наслаждайтесь путешествиями со смыслом свободно",
            image: benefitImage1,
        },
        {
            title: "Больше возможностей",
            text: "Гудсёрфинг объединяет самые разные направления путешествия со смыслом: от волонтёрства на фермах до археологических экспедиций",
            image: benefitImage2,
        },
        {
            title: "Надёжно",
            text: "Все принимающие стороны проходят проверку и участвуют в рейтинге. Отзывы открыты для всех и каждый может рассказать о всех нюансах",
            image: benefitImage3,
        },
    ];

    const translatedData = benefitsData.map((item) => ({
        ...item,
        title: t(item.title),
        text: t(item.text),
    }));

    return translatedData;
};
