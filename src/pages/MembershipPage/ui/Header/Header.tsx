import React from "react";

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Button from "@/shared/ui/Button/Button";
import { useLocale } from "@/app/providers/LocaleProvider";
import { getPaymentPageUrl } from "@/shared/config/routes/AppUrls";
import { useGetTariffsQuery } from "@/store/api/membershipApi";
import styles from "./Header.module.scss";

const DEFAULT_TARIFF_CODE = "volunteer_990";
const DEFAULT_FALLBACK_PRICE_RUB = 990;

export const Header = () => {
    const { t } = useTranslation("membership");
    const navigate = useNavigate();
    const { locale } = useLocale();

    const { data: tariffs } = useGetTariffsQuery();
    const minPriceRub = tariffs && tariffs.length > 0
        ? Math.min(...tariffs.map((item) => item.priceRub))
        : DEFAULT_FALLBACK_PRICE_RUB;

    const handleGetMembership = () => {
        navigate(`${getPaymentPageUrl(locale)}?tariff=${DEFAULT_TARIFF_CODE}`);
    };

    return (
        <section className={styles.wrapeprImage}>
            <h1 className={styles.title}>
                <span>{t("header.Оформи членство Гудсёрфинга")}</span>
                <br />
                <span>{t("header.и открой для себя бескрайний мир")}</span>
                <br />
                <span>{t("header.путешествий со смыслом!")}</span>
            </h1>
            <ul className={styles.list}>
                <li>{t("header.Неограниченный доступ ко всем направлениям и видам путешествий")}</li>
                <li>{t("header.Прямое общение с хостом")}</li>
                <li>{t("header.Поддержка в путешествиях со стороны Гудсёрфинга")}</li>
                <li>{t("header.Доступ к образовательным материалам")}</li>
                <li>{t("header.Поддержка интересного и важного проекта")}</li>
            </ul>
            <div className={styles.buttonPrice}>
                <Button
                    color="GREEN"
                    size="SMALL"
                    variant="FILL"
                    onClick={handleGetMembership}
                >
                    {t("header.Получить членство")}
                </Button>
                <span className={styles.price}>
                    {`от ${minPriceRub.toLocaleString("ru-RU")} руб`}
                </span>
            </div>
        </section>
    );
};
