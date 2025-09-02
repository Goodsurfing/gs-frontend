import React from "react";

import { useTranslation } from "react-i18next";
import { MainPageLayout } from "@/widgets/MainPageLayout";

// import Button from "@/shared/ui/Button/Button";

import { Founders } from "../Founders/Founders";
import { GoodsurfingTeam } from "../GoodsurfingTeam/GoodsurfingTeam";
import { Header } from "../Header/Header";
import styles from "./OurTeamPage.module.scss";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import { getProfilePageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";

const OurTeamPage = () => {
    const { t } = useTranslation("our-team");
    const { locale } = useLocale();

    return (
        <MainPageLayout>
            <div className={styles.wrapper}>
                <Header />
                <div className={styles.content}>
                    <Founders />
                    <GoodsurfingTeam />
                    <ButtonLink
                        className={styles.button}
                        path={getProfilePageUrl(locale)}
                        type="primary"
                        size="MEDIUM"
                        // size="MEDIUM"
                        // color="BLUE"
                        // variant="FILL"
                    >
                        {t("Хочу в команду")}
                    </ButtonLink>
                </div>
            </div>
        </MainPageLayout>
    );
};

export default OurTeamPage;
