import AOS from "aos";
import "aos/dist/aos.css";
import { memo, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import VolunteerItem from "@/containers/VolunteerContainer/VolunteerItem/VolunteerItem";
import { useVolunteerData } from "@/containers/VolunteerContainer/Volunteer.data";

import { useLocale } from "@/app/providers/LocaleProvider";

import { getProfileRolePageUrl } from "@/shared/config/routes/AppUrls";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";

import styles from "./VolunteerContainer.module.scss";

const VolunteerContainer = memo(() => {
    const volunteerData = useVolunteerData();
    const { t } = useTranslation("main");

    useEffect(() => {
        AOS.init({ duration: 1000, once: true });

        return () => {
            AOS.refreshHard();
        };
    }, []);

    const volunteerDataList = useMemo(
        () => volunteerData.map((item, index) => (
            <VolunteerItem
                key={item.number}
                dataAos={index % 2 === 0 ? "fade-up" : "fade-down"}
                {...item}
            />
        )),
        [],
    );

    const { locale } = useLocale();

    return (
        <div className={styles.wrapper}>
            <h2 className={styles.title}>{t("Стань волонтёром")}</h2>
            <p className={styles.description}>
                {t(
                    "Быть гудсёрфером",
                )}
            </p>
            <div className={styles.content}>{volunteerDataList}</div>
            <ButtonLink type="secondary" path={getProfileRolePageUrl(locale)}>
                {t("Начать сейчас")}
            </ButtonLink>
        </div>
    );
});

export default VolunteerContainer;
