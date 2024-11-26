import { memo, useEffect, useMemo } from "react";
import AOS from "aos";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import "aos/dist/aos.css";

import { volunteerData } from "@/containers/VolunteerContainer/Volunteer.data";
import VolunteerItem from "@/containers/VolunteerContainer/VolunteerItem/VolunteerItem";

import styles from "./VolunteerContainer.module.scss";
import { getProfileRolePageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";

const VolunteerContainer = memo(() => {
    useEffect(() => {
        AOS.init({ duration: 1000, once: true });

        return () => {
            AOS.refreshHard();
        };
    }, []);

    const volunteerDataList = useMemo(() => volunteerData.map((item, index) => (
        <VolunteerItem key={item.number} dataAos={index % 2 === 0 ? "fade-up" : "fade-down"} {...item} />)), []);

    const { locale } = useLocale();

    return (
        <div className={styles.wrapper}>
            <h2 className={styles.title}>Стань волонтёром</h2>
            <p className={styles.description}>
                Быть гудсёрфером — значит путешествовать по миру с наименьшими
                издержками и при этом делать по-настоящему важное дело. В
                гудсёрфинге вы погружаетесь в местную культуру, знакомитесь с
                интересными людьми, получаете новый опыт, открываете для себя
                мир по-настоящему. Готовы к своему новому приключению?
            </p>
            <div className={styles.content}>
                {volunteerDataList}
            </div>
            <ButtonLink type="secondary" path={getProfileRolePageUrl(locale)}>
                Начать сейчас
            </ButtonLink>
        </div>
    );
});

export default VolunteerContainer;
