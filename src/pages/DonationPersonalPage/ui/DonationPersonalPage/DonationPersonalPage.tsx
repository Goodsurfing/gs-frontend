import { useParams } from "react-router-dom";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Footer } from "@/widgets/Footer";
import MainHeader from "@/widgets/MainHeader/MainHeader";

import Preloader from "@/shared/ui/Preloader/Preloader";
import { Text } from "@/shared/ui/Text/Text";
import { useAuth } from "@/routes/model/guards/AuthProvider";
import { GetDonation, useLazyGetDonationByIdQuery } from "@/entities/Donation";
import { useLocale } from "@/app/providers/LocaleProvider";
import { DonationPersonalCard } from "../DonationPersonalCard/DonationPersonalCard";
import { DonationSubmenu } from "@/widgets/Donation";
import { DonationPageContent } from "../DonationPageContent/DonationPageContent";
import styles from "./DonationPersonalPage.module.scss";

export const DonationPersonalPage = () => {
    const { id } = useParams<{ id: string }>();
    const [donationData, setDonationData] = useState<GetDonation>();
    const { myProfile } = useAuth();
    const { locale } = useLocale();
    const { ready } = useTranslation();
    const { ready: readyDonation } = useTranslation("donation");

    const [getDonationData, { isLoading, isError }] = useLazyGetDonationByIdQuery();

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                if (id) {
                    const result = await getDonationData({ id, lang: locale });
                    if (result.data) {
                        setDonationData(result.data);
                    }
                }
            } catch { /* empty */ }
        };

        fetchDonations();
    }, [getDonationData, id, locale]);

    if (isLoading || !ready || !readyDonation) {
        return (
            <div className={styles.wrapper}>
                <Preloader />
            </div>
        );
    }

    if (!id || isError) {
        return (
            <div className={styles.wrapper}>
                <MainHeader />
                <div className={styles.content}>
                    <Text
                        className={styles.error}
                        textSize="primary"
                        text="Произошла ошибка"
                    />
                </div>
                <Footer />
            </div>
        );
    }

    if (donationData) {
        if (donationData.status === "draft") {
            return (
                <div className={styles.wrapper}>
                    <MainHeader />
                    <div className={styles.content}>
                        <Text
                            className={styles.error}
                            textSize="primary"
                            text="Сбор не опубликован"
                        />
                    </div>
                    <Footer />
                </div>
            );
        }

        return (
            <div className={styles.wrapper}>
                <MainHeader />
                <div className={styles.content}>
                    <DonationPersonalCard
                        id={id}
                        donationData={donationData}
                        isVolunteer={!!myProfile?.volunteer}
                    />
                    <DonationSubmenu
                        donationData={donationData}
                        isVolunteer={!!myProfile?.volunteer}
                    />
                    <DonationPageContent donationData={donationData} />
                </div>
                <Footer />
            </div>
        );
    }

    return null;
};
