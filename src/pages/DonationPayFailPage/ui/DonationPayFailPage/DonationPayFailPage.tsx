import React from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { MainPageLayout } from "@/widgets/MainPageLayout";
import Button from "@/shared/ui/Button/Button";

import { useLocale } from "@/app/providers/LocaleProvider";
import { getDonationPayPageUrl, getDonationPersonalPage } from "@/shared/config/routes/AppUrls";

import styles from "./DonationPayFailPage.module.scss";

const DonationPayFailPage: React.FC = () => {
    const { locale } = useLocale();
    const navigate = useNavigate();
    const { id: fundraiseId } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();

    const reason = searchParams.get("reason") || "error";

    const reasonText: Record<string, string> = {
        error: "Произошла ошибка при обработке платежа.",
        cancelled: "Платёж был отменён.",
        not_found: "Платёж не найден.",
    };

    return (
        <MainPageLayout>
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={styles.icon}>&#10007;</div>
                    <h1 className={styles.title}>Платёж не прошёл</h1>
                    <p className={styles.text}>
                        {reasonText[reason] || reasonText.error}
                    </p>
                    <div className={styles.buttons}>
                        <Button
                            color="BLUE"
                            size="LARGE"
                            variant="FILL"
                            onClick={() => navigate(getDonationPayPageUrl(locale, fundraiseId))}
                        >
                            Попробовать снова
                        </Button>
                        <Button
                            color="GRAY"
                            size="MEDIUM"
                            variant="TEXT"
                            onClick={() => navigate(getDonationPersonalPage(locale, fundraiseId))}
                        >
                            Вернуться к сбору
                        </Button>
                    </div>
                </div>
            </div>
        </MainPageLayout>
    );
};

export default DonationPayFailPage;
