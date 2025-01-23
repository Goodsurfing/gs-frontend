import React, { FC, useEffect } from "react";
import cn from "classnames";
import AOS from "aos";
import "aos/dist/aos.css";
import { howItWorkData } from "@/containers/HowItWorkContainer/HowItWork.data";
import HowItWorkItem from "@/containers/HowItWorkContainer/HowItWorkItem/HowItWorkItem";

import { useLocale } from "@/app/providers/LocaleProvider";

import { getMembershipPageUrl } from "@/shared/config/routes/AppUrls";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";

import styles from "./HowItWorkContainer.module.scss";

interface HowItWorkContainerProps {
    className?: string;
}

const HowItWorkContainer: FC<HowItWorkContainerProps> = (props) => {
    const { className } = props;
    const { locale } = useLocale();

    useEffect(() => {
        AOS.init({ duration: 1000, once: true });

        return () => {
            AOS.refreshHard();
        };
    }, []);

    return (
        <div className={cn(className, styles.wrapper)}>
            <div className={styles.content}>
                {howItWorkData
                    && howItWorkData.map((item, index) => (
                        <HowItWorkItem
                            title={item.title}
                            text={item.text}
                            image={item.image}
                            key={index}
                            dataAos={index % 2 === 0 ? "fade-down" : "fade-up"}
                        />
                    ))}
            </div>
            <ButtonLink path={getMembershipPageUrl(locale)} type="primary">
                Как это работает
            </ButtonLink>
        </div>
    );
};

export default HowItWorkContainer;
