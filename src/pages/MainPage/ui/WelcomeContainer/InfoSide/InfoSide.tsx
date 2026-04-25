import {
    FC, memo, useCallback, useRef,
} from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import SectionTitle from "@/shared/ui/SectionTitle/SectionTitle";

import { useLocale } from "@/app/providers/LocaleProvider";

import { InfoSearchOffers } from "./InfoSearchOffers/InfoSearchOffers";
import { SearchOffersRef } from "@/widgets/OffersMap/ui/SearchOffers/SearchOffers";
import ActivityContainer from "./ActivityContainer/ActivityContainer";
import styles from "./InfoSide.module.scss";

const InfoSide: FC = memo(() => {
    const { t } = useTranslation();
    const { locale } = useLocale();
    const navigate = useNavigate();
    const searchRef = useRef<SearchOffersRef>(null);

    const onApplySearch = useCallback(async (search: string) => {
        navigate(`/${locale}/offers-map?search=${encodeURIComponent(search)}`);
    }, [navigate, locale]);

    const onResetFilters = useCallback(async () => {
        searchRef.current?.clearSearch();
    }, []);

    return (
        <div className={styles.wrapper}>
            <div className={styles.content}>
                <div className={styles.info}>
                    <SectionTitle classNames={styles.title}>
                        {t("main.welcome.title")}
                    </SectionTitle>
                    <InfoSearchOffers
                        className={styles.searchWrapper}
                        onSubmit={onApplySearch}
                        onResetFilters={onResetFilters}
                        placeholder={t("Поиск")}
                        buttonText={t("Посмотреть все")}
                        ref={searchRef}
                    />
                </div>

                <ActivityContainer locale={locale} className={styles.categories} />
                <div className={styles.activity}>
                    <h3 className={styles.activityTitle}>
                        {t("main.welcome.activity-title")}
                    </h3>
                </div>
            </div>
        </div>
    );
});

export default InfoSide;
