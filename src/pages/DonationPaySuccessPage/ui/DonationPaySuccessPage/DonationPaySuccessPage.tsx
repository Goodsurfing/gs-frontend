import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import { MainPageLayout } from "@/widgets/MainPageLayout";
import Button from "@/shared/ui/Button/Button";

import { useLocale } from "@/app/providers/LocaleProvider";
import { getDonationPersonalPage } from "@/shared/config/routes/AppUrls";

import styles from "./DonationPaySuccessPage.module.scss";

const DonationPaySuccessPage: React.FC = () => {
    const { locale } = useLocale();
    const navigate = useNavigate();
    const { id: fundraiseId } = useParams<{ id: string }>();

    return (
        <MainPageLayout>
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.icon}>&#10003;</div>
                    <h1 className={styles.title}>Спасибо за пожертвование!</h1>
                    <p className={styles.text}>
                        Ваш платёж успешно обработан. Благодарим вас за поддержку проекта.
                    </p>
                    <Button
                        color="BLUE"
                        size="LARGE"
                        variant="FILL"
                        onClick={() => navigate(getDonationPersonalPage(locale, fundraiseId))}
                    >
                        Вернуться к сбору
                    </Button>
                </div>
            </div>
        </MainPageLayout>
    );
};

export default DonationPaySuccessPage;
