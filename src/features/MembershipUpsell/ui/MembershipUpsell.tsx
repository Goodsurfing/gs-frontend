import cn from "classnames";
import { FC, memo } from "react";
import { useTranslation } from "react-i18next";

import { useLocale } from "@/app/providers/LocaleProvider";
import { getMembershipPageUrl } from "@/shared/config/routes/AppUrls";
import LocaleLink from "@/shared/ui/LocaleLink/LocaleLink";
import { useGetTariffsQuery } from "@/store/api/membershipApi";

import styles from "./MembershipUpsell.module.scss";

/** Цена, если тарифы не загрузились — как FALLBACK_PRICE страницы членства */
const FALLBACK_PRICE = 990;
const VOLUNTEER_TARIFF = "volunteer_990";

interface MembershipUpsellProps {
    /** light — на тёмной карточке вакансии, dark — в светлом меню разделов */
    variant: "light" | "dark";
    className?: string;
}

/**
 * Бесплатные отклики на год кончились (GS-169): вместо мелкой подсказки —
 * предложение членства с ценой и зелёной кнопкой на страницу членства.
 */
export const MembershipUpsell: FC<MembershipUpsellProps> = memo((props: MembershipUpsellProps) => {
    const { variant, className } = props;
    const { t } = useTranslation("offer");
    const { locale } = useLocale();
    const { data: tariffs } = useGetTariffsQuery("VOLUNTEER");
    const price = tariffs?.find((tariff) => tariff.code === VOLUNTEER_TARIFF)?.priceRub
        ?? FALLBACK_PRICE;

    const title = t("personalOffer.Бесплатные отклики на этот год закончились");

    return (
        <div
            role="note"
            aria-label={title}
            className={cn(styles.wrapper, styles[variant], className)}
        >
            <p className={styles.title}>{title}</p>
            <p>
                {t("personalOffer.Членство — {{price}} ₽ на год: отклики без ограничений", { price })}
            </p>
            <LocaleLink to={getMembershipPageUrl(locale)} className={styles.button}>
                {t("personalOffer.Оформить членство")}
            </LocaleLink>
        </div>
    );
});
