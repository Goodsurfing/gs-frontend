import React, { FC, memo } from "react";

import { AppRoutes } from "app/router";

import HowItWorkItem from "widgets/HowItWorkContainer/ui/HowItWorkItem/HowItWorkItem";

import { ButtonLink } from "shared/ui/ButtonLink";

import { howItWorkData } from "../../model/data/HowItWork.data";

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
        <ButtonLink path={AppRoutes.MAIN} type="primary">
            Как это работает
        </ButtonLink>
    </div>
);

export const MemoHowItWorkContainer = memo(HowItWorkContainer);
