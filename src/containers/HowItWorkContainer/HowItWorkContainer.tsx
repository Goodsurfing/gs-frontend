import React, { FC } from "react";
import cn from "classnames";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";

import { howItWorkData } from "@/containers/HowItWorkContainer/HowItWork.data";
import HowItWorkItem from "@/containers/HowItWorkContainer/HowItWorkItem/HowItWorkItem";
import styles from "./HowItWorkContainer.module.scss";
import { getMembershipPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";

interface HowItWorkContainerProps {
    className?: string;
}

const HowItWorkContainer: FC<HowItWorkContainerProps> = (props) => {
    const { className } = props;
    const { locale } = useLocale();

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
