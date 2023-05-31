import React, { FC, memo } from "react";

import { ButtonLink } from "shared/ui/ButtonLink";

import { volunteerData } from "../../model/data/Volunteer.data";
import { MemoVolunteerItem as VolunteerItem } from "../VolunteerItem/VolunteerItem";

import styles from "./VolunteerContainer.module.scss";

const VolunteerContainer: FC = () => (
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
            {volunteerData
                    && volunteerData.map((item) => <VolunteerItem key={item.number} {...item} />)}
        </div>
        <ButtonLink type="secondary" path="">
            Начать сейчас
        </ButtonLink>
    </div>
);

export const MemoVolunteerContainer = memo(VolunteerContainer);