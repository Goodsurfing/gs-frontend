import React, { FC } from "react";

import Button from "@/components/ui/Button/Button";

import { volunteerData } from "@/containers/VolunteerContainer/Volunteer.data";
import VolunteerItem from "@/containers/VolunteerContainer/VolunteerItem/VolunteerItem";

import styles from "./VolunteerContainer.module.scss";

const VolunteerContainer: FC = () => {
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
                {volunteerData &&
                    volunteerData.map((item) => (
                        <VolunteerItem key={item.number} {...item} />
                    ))}
            </div>
            <Button type={"secondary"} path={"/"}>
                Начать сейчас
            </Button>
        </div>
    );
};

export default VolunteerContainer;
