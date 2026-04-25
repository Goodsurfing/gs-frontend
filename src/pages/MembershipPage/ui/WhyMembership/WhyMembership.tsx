import cn from "classnames";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import styles from "./WhyMembership.module.scss";

interface WhyMembershipProps {
    className?: string;
}

export const WhyMembership: FC<WhyMembershipProps> = ({ className }) => {
    const { t } = useTranslation("membership");

    return (
        <section className={cn(className, styles.wrapper)}>
            <div className={styles.inner}>
                <div className={styles.text}>
                    <h2 className={styles.title}>
                        {t("why-membership.title", "Зачем нужно членство")}
                    </h2>
                    <p className={styles.paragraph}>
                        {t(
                            "why-membership.p1",
                            "Гудсёрфинг родился из идеи, что путешествия могут быть не только увлекательными, но и полезными. Вдохновившись идеей взаимопомощи, мы создали платформу, которая делает выездное волонтёрство доступным, понятным и безопасным. Сегодня мы — международное сообщество, объединяющее тысячи людей, которые готовы помогать другим, делать себя и мир вокруг лучше.",
                        )}
                    </p>
                    <p className={styles.paragraph}>
                        {t(
                            "why-membership.p2",
                            "Чтобы Гудсёрфинг оставался живым проектом, ему нужна опора. Этой опорой являются сами участники сообщества.",
                        )}
                    </p>
                    <p className={styles.paragraphAccent}>
                        {t(
                            "why-membership.p3",
                            "Ваше членство — это вклад в то, чтобы добрые путешествия и волонтёрские проекты продолжали существовать.",
                        )}
                    </p>
                </div>
                <div className={styles.imageWrap}>
                    <img
                        className={styles.image}
                        src="/images/membership/community.jpg"
                        alt="Волонтёры Гудсёрфинга"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                        }}
                    />
                </div>
            </div>
        </section>
    );
};
