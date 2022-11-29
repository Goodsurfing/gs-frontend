import React, { FC } from "react";

import Button from "@/components/ui/Button/Button";

import { howItWorkData } from "@/containers/HowItWorkContainer/HowItWork.data";
import HowItWorkItem from "@/containers/HowItWorkContainer/HowItWorkItem/HowItWorkItem";

import styles from "./HowItWorkContainer.module.scss";

const HowItWorkContainer: FC = () => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.content}>
                {howItWorkData &&
                    howItWorkData.map((item, index) => (
                        <HowItWorkItem
                            title={item.title}
                            text={item.text}
                            image={item.image}
                            key={index}
                        />
                    ))}
            </div>
            <Button path={"/"} type={"primary"}>
                Как это работает
            </Button>
        </div>
    );
};

export default HowItWorkContainer;
