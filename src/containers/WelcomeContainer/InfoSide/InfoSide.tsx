import {
    FC, memo, useCallback, useRef,
} from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import SectionTitle from "@/shared/ui/SectionTitle/SectionTitle";

// import ActivityContainer from
// "@/containers/WelcomeContainer/InfoSide/ActivityContainer/ActivityContainer";
import { useLocale } from "@/app/providers/LocaleProvider";

import { ChangeLanguage } from "@/widgets/ChangeLanguage";
import { useAuth } from "@/routes/model/guards/AuthProvider";
import LogotypeIcon from "@/shared/assets/icons/logo-black.svg";
import { InfoSearchOffers } from "./InfoSearchOffers/InfoSearchOffers";
import styles from "./InfoSide.module.scss";
import { SearchOffersRef } from "@/widgets/OffersMap/ui/SearchOffers/SearchOffers";

const InfoSide: FC = memo(() => {
    const { t } = useTranslation();
    const { myProfile } = useAuth();
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
            <div className={styles.logo}>
                <img
                    src={LogotypeIcon}
                    alt="Logotype"
                    className={styles.logotype}
                />
                <ChangeLanguage localeApi={myProfile?.locale} profileData={myProfile} />
            </div>
            <div className={styles.content}>
                <div className={styles.info}>
                    <SectionTitle classNames={styles.title}>
                        {t("main.welcome.title")}
                    </SectionTitle>
                    {/* <ButtonLink className={styles.btn} type="primary"
                    path={getOffersMapPageUrl(locale)}>
                        {t("main.welcome.offers-btn")}
                    </ButtonLink> */}
                    <InfoSearchOffers
                        className={styles.searchWrapper}
                        onSubmit={onApplySearch}
                        onResetFilters={onResetFilters}
                        placeholder={t("Поиск")}
                        buttonText={t("Посмотреть все")}
                        ref={searchRef}
                    />
                </div>

                {/* <ActivityContainer locale={locale} /> */}
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
