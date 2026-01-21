import React from "react";

import { useTranslation } from "react-i18next";
import Button from "@/shared/ui/Button/Button";
import { useCreatePaymentMutation } from "@/store/api/paymentApi";
import styles from "./Header.module.scss";

export const Header = () => {
    const { t } = useTranslation("membership");
    const [createPayment, { isLoading }] = useCreatePaymentMutation();

    const handleGetMembership = async () => {
        try {
            const response = await createPayment({
                amount: "1500.00",
                description: "Оплата членства Гудсёрфинга",
                currency: "RUB",
            }).unwrap();

            if (response.payment_url) {
                window.location.href = response.payment_url;
            }
        } catch (error) {
            console.error("Ошибка при создании платежа:", error);
        }
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
                    disabled={isLoading}
                >
                    {isLoading ? t("header.Обработка...") || "Обработка..." : t("header.Получить членство")}
                </Button>
                <span className={styles.price}>1 500 руб</span>
            </div>
        </section>
    );
};
