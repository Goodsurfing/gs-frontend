import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { MainPageLayout } from "@/widgets/MainPageLayout";
import Button from "@/shared/ui/Button/Button";

import { useLocale } from "@/app/providers/LocaleProvider";
import { getDonationPersonalPage } from "@/shared/config/routes/AppUrls";

import styles from "./DonationPaySuccessPage.module.scss";
import { trackGoalOnce } from "@/shared/lib/analytics";

const DonationPaySuccessPage: React.FC = () => {
    const { t } = useTranslation("donation");
    const { locale } = useLocale();
    const navigate = useNavigate();
    const { id: fundraiseId } = useParams<{ id: string }>();

    // Сюда возвращает ЮKassa после оплаты; повторное открытие в той же сессии не считаем
    useEffect(() => {
        trackGoalOnce("donation_paid", fundraiseId ?? "unknown");
    }, [fundraiseId]);

    return (
        <MainPageLayout>
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.icon}>&#10003;</div>
                    <h1 className={styles.title}>{t("Спасибо за пожертвование!")}</h1>
                    <p className={styles.text}>
                        {t("Ваш платёж успешно обработан Благодарим вас за поддержку проекта")}
                    </p>
                    <Button
                        color="BLUE"
                        size="LARGE"
                        variant="FILL"
                        onClick={() => navigate(getDonationPersonalPage(locale, fundraiseId))}
                    >
                        {t("Вернуться к сбору")}
                    </Button>
                </div>
            </div>
        </MainPageLayout>
    );
};

export default DonationPaySuccessPage;
