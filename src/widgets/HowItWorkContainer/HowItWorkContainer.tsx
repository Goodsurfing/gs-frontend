import React, { FC } from "react";

import { howItWorkData } from "widgets/HowItWorkContainer/HowItWork.data";
import HowItWorkItem from "widgets/HowItWorkContainer/HowItWorkItem/HowItWorkItem";

import ButtonLink from "shared/ui/ButtonLink/ButtonLink";

import styles from "./HowItWorkContainer.module.scss";

const HowItWorkContainer: FC = () => (
    <div className={styles.wrapper}>
        <div className={styles.content}>
            {howItWorkData
                    && howItWorkData.map((item, index) => (
                        <HowItWorkItem
                            title={item.title}
                            text={item.text}
                            image={item.image}
                            key={index}
                        />
                    ))}
        </div>
        <ButtonLink path="" type="primary">
            Как это работает
        </ButtonLink>
    </div>
);

export default HowItWorkContainer;
