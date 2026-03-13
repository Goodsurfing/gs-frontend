import cn from "classnames";
import React, {
    FC, memo, useEffect, useState,
} from "react";
import { useTranslation } from "react-i18next";

import { useLocale } from "@/app/providers/LocaleProvider";

import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";

import { useGetProfileInfoQuery } from "@/entities/Profile";
import { donationCardAdapter, useLazyGetDonationsQuery, VolunteerDonationCard } from "@/entities/Donation";
import { AdminSort } from "@/entities/Admin";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import styles from "./DonationsRecomendationsWidget.module.scss";

interface DonationsRecomendationsWidgetProps {
    className?: string;
}

export const DonationsRecomendationsWidget: FC<DonationsRecomendationsWidgetProps> = memo(
    (props: DonationsRecomendationsWidgetProps) => {
        const { className } = props;
        const { locale } = useLocale();
        const { t } = useTranslation("donation");
        const [toast, setToast] = useState<ToastAlert>();

        const { data: myProfileData, isLoading: isProfileLoading } = useGetProfileInfoQuery();
        const [getDonations, {
            isLoading: isDonationsLoading,
            data: donationsData,
        }] = useLazyGetDonationsQuery();

        useEffect(() => {
            const fetchDonations = async () => {
                try {
                    if (myProfileData && myProfileData.favoriteCategories.length > 0) {
                        await getDonations(
                            {
                                sort: AdminSort.EndDateAsc,
                            },
                        ).unwrap();
                    }
                } catch {
                    setToast({
                        text: t("donationRecommendation.Произошла ошибка загрузки пожертвований"),
                        type: HintType.Error,
                    });
                }
            };
            fetchDonations();
        }, [getDonations, myProfileData, t]);

        const renderDonations = () => {
            if (isProfileLoading || isDonationsLoading) {
                return <MiniLoader />;
            }

            if (donationsData?.data && donationsData.data.length > 0) {
                return donationsData.data.map((donation) => (
                    <VolunteerDonationCard
                        data={donationCardAdapter(donation)}
                        locale={locale}
                        key={donation.id}
                    />
                ));
            }
            return (
                <span>{t("donationRecommendation.На данный момент проектов нет")}</span>
            );
        };

        return (
            <div className={cn(className, styles.wrapper)}>
                {toast && <HintPopup text={toast.text} type={toast.type} />}
                <div className={styles.top}>
                    <h3>
                        {t(
                            "donationRecommendation.Поддержать другие проекты",
                        )}
                    </h3>
                </div>
                <div className={styles.container}>{renderDonations()}</div>
            </div>
        );
    },
);
