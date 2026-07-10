import cn from "classnames";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import checkIcon from "@/shared/assets/images/membership/check.svg";
import internationalClubImage from "@/shared/assets/images/membership/international-club.png";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";

import styles from "./InternationalClub.module.scss";

interface InternationalClubProps {
    className?: string;
}

const INTERNATIONAL_CLUB_URL = "https://international.goodsurfing.org/";

export const InternationalClub: FC<InternationalClubProps> = ({ className }) => {
    const { t } = useTranslation("membership");

    const membershipBenefits = [
        t("international-club.benefit-1"),
        t("international-club.benefit-2"),
        t("international-club.benefit-3"),
        t("international-club.benefit-4"),
        t("international-club.benefit-5"),
        t("international-club.benefit-6"),
    ];
    const contributionBenefits = [
        t("international-club.contribution-1"),
        t("international-club.contribution-2"),
        t("international-club.contribution-3"),
        t("international-club.contribution-4"),
    ];

    return (
        <section className={cn(className, styles.wrapper)} aria-labelledby="international-club-title">
            <div className={styles.inner}>
                <header className={styles.header}>
                    <h2 id="international-club-title" className={styles.title}>
                        {t("international-club.title")}
                    </h2>
                    <p className={styles.subtitle}>{t("international-club.subtitle")}</p>
                    <p className={styles.description}>{t("international-club.description")}</p>
                </header>

                <div className={styles.clubContent}>
                    <div className={styles.card}>
                        <h3 className={styles.cardTitle}>{t("international-club.includes-title")}</h3>
                        <ul className={styles.membershipList}>
                            {membershipBenefits.map((benefit) => (
                                <li key={benefit}>{benefit}</li>
                            ))}
                        </ul>
                        <ButtonLink
                            className={styles.primaryButton}
                            path={INTERNATIONAL_CLUB_URL}
                            type="primary"
                        >
                            {t("international-club.join-button")}
                        </ButtonLink>
                    </div>

                    <div className={styles.imageWrapper}>
                        <img
                            className={styles.image}
                            src={internationalClubImage}
                            alt={t("international-club.image-alt")}
                            loading="lazy"
                        />
                    </div>
                </div>

                <div className={styles.contribution}>
                    <h3 className={styles.contributionTitle}>{t("international-club.contribution-title")}</h3>
                    <p className={styles.contributionDescription}>
                        {t("international-club.contribution-description")}
                    </p>
                    <ul className={styles.contributionList}>
                        {contributionBenefits.map((benefit) => (
                            <li key={benefit}>
                                <img
                                    className={styles.check}
                                    src={checkIcon}
                                    alt=""
                                    aria-hidden="true"
                                />
                                <span>{benefit}</span>
                            </li>
                        ))}
                    </ul>
                    <ButtonLink
                        className={styles.secondaryButton}
                        path={INTERNATIONAL_CLUB_URL}
                        type="secondary"
                    >
                        {t("international-club.learn-more-button")}
                    </ButtonLink>
                </div>
            </div>
        </section>
    );
};
