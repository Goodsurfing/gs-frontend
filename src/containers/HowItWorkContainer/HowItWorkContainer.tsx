import ButtonLink from "@/UI/ButtonLink/ButtonLink";
import React, { FC } from "react";

import { howItWorkData } from "@/containers/HowItWorkContainer/HowItWork.data";
import HowItWorkItem from "@/containers/HowItWorkContainer/HowItWorkItem/HowItWorkItem";

import styles from "./HowItWorkContainer.module.scss";

const HowItWorkContainer: FC = () => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.content}>
                {howItWorkData &&
                    howItWorkData.map((item, index) => {
                        return (
                            <HowItWorkItem
                                title={item.title}
                                text={item.text}
                                image={item.image}
                                key={index}
                            />
                        );
                    })}
            </div>
            <ButtonLink path="/" type="primary">
                Как это работает
            </ButtonLink>
        </div>
    );
};

export default HowItWorkContainer;
