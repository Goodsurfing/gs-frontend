import { memo, useMemo } from "react";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";

import { volunteerData } from "@/containers/VolunteerContainer/Volunteer.data";
import VolunteerItem from "@/containers/VolunteerContainer/VolunteerItem/VolunteerItem";

import styles from "./VolunteerContainer.module.scss";
import { getHostPageUrl, getSignInPageUrl, useLocale } from "@/routes";
import { useAppSelector } from "@/shared/hooks/redux";
import { getUserAuthData } from "@/entities/User";

const VolunteerContainer = memo(() => {
    const volunteerDataList = useMemo(() => volunteerData.map((item) => (
        <VolunteerItem key={item.number} {...item} />)), []);

    const { locale } = useLocale();

    const authData = useAppSelector(getUserAuthData);

    const path = authData ? getSignInPageUrl(locale) : getHostPageUrl(locale);

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
            <ButtonLink type="secondary" path={path}>
                Начать сейчас
            </ButtonLink>
        </div>
    );
});

export default VolunteerContainer;
