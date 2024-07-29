import cn from "classnames";
import React, { FC } from "react";

import styles from "./SeasonalWork.module.scss";

interface SeasonalWorkProps {
    className?: string;
}

export const SeasonalWork: FC<SeasonalWorkProps> = (props) => {
    const { className } = props;
    return (
        <div className={cn(className, styles.wrapper)}>
            <h2 className={styles.title}>Сезонная работа</h2>
            <p className={styles.description}>
                Сезонная работа за границей дает возможность попрактиковаться в
                иностранном языке, познакомиться со страной, посмотреть как
                живут люди. Для летнего периода можно подобрать сезонную работу
                на туристических курортах. В зимний же сезон всегда требуются
                работники на горнолыжные центры. Это могут быть вакансии
                аниматоров, официантов или помощников на кухне. Большой выбор
                работы по уборке фруктов и овощей. Сбор клубники, малины, черной
                и красной смородины, яблок - это самые популярные варианты
                работ, которые предлагаются в Европе. Данная хороша тем, что не
                требуется больших языковых знаний, позволяет заработать денег,
                познакомиться с жизнью людей в другой стране. Еще вариантом для
                трудоустройства на сезон является работа в заповедниках, работа
                по уходу за детьми, престарелыми или больными людьми.
            </p>
        </div>
    );
};
