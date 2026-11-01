import { memo } from "react";
import { useTranslation } from "react-i18next";
import { NavMenuLink } from "@/shared/ui/NavMenuLink/NavMenuLink";

import { useLocale } from "@/app/providers/LocaleProvider";

import { ChangeLanguage } from "@/widgets/ChangeLanguage";

import footerLogo from "@/shared/assets/icons/footer/logo.svg";
import tgIcon from "@/shared/assets/icons/footer/telegram.svg";
import vkIcon from "@/shared/assets/icons/footer/vk.svg";
import youtubeIcon from "@/shared/assets/icons/footer/youtube.svg";
import maxIcon from "@/shared/assets/icons/footer/max.svg";
import {
    getAboutProjectPageUrl,
    getAcademyMainPageUrl,
    getAmbassadorsPageUrl,
    getBecomeHostPageUrl,
    getBlogPageUrl,
    getFeedbackPageUrl,
    getFindJobPageUrl,
    getMembershipPageUrl,
    getNewsPageUrl,
    getNPOPageUrl,
    getOurTeamPageUrl,
    getPaymentSecurityPolicyPageUrl,
    getPrivacyPolicyPageUrl,
    getRulesPageUrl,
    getVideoPageUrl,
} from "@/shared/config/routes/AppUrls";

import styles from "./Footer.module.scss";
import { useAuth } from "@/routes/model/guards/AuthProvider";

export const Footer = memo(() => {
    const { locale } = useLocale();
    const { t } = useTranslation();
    const { myProfile } = useAuth();

    return (
        <>
            <footer className={styles.footer}>
                <div className={styles.container}>
                    <div className={styles.info}>
                        <div className={styles.logo}>
                            <img
                                className={styles.logotype}
                                src={footerLogo}
                                alt="GoodSurfing"
                            />
                            <ChangeLanguage
                                localeApi={myProfile?.locale}
                                profileData={myProfile}
                            />
                        </div>
                        <div className={styles.socials}>
                            <a
                                href="https://telegram.me/goodsurfing"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <img src={tgIcon} alt="Telegram" />
                            </a>
                            <a
                                href="https://vk.com/goodsurfing"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <img src={vkIcon} alt="VK" />
                            </a>
                            <a
                                href="https://www.youtube.com/@goodsurfing"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <img src={youtubeIcon} alt="YouTube" />
                            </a>
                            <a
                                href="https://max.ru/goodsurfing"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <img src={maxIcon} alt="MAX" />
                            </a>
                        </div>
                    </div>

                    <nav className={styles.menu}>
                        <div className={styles.menu__item}>
                            <h4 className={styles.menu__title}>
                                {t("main.welcome.header.community.title")}
                            </h4>
                            <div className={styles.menu__content}>
                                <NavMenuLink
                                    className={styles.link}
                                    to={getBlogPageUrl(locale)}
                                >
                                    {t("main.welcome.header.community.blog")}
                                </NavMenuLink>
                                <NavMenuLink
                                    className={styles.link}
                                    to={getVideoPageUrl(locale)}
                                >
                                    {t("main.welcome.header.community.video")}
                                </NavMenuLink>
                                {/* <NavMenuLink
                                    className={styles.link}
                                    to={getMainPageUrl(locale)}
                                >
                                    {t("main.welcome.header.community.experts")}
                                </NavMenuLink> */}
                                <NavMenuLink
                                    className={styles.link}
                                    to={getAmbassadorsPageUrl(locale)}
                                >
                                    {t(
                                        "main.welcome.header.community.ambassadors",
                                    )}
                                </NavMenuLink>
                                <NavMenuLink
                                    className={styles.link}
                                    to={getAcademyMainPageUrl(locale)}
                                >
                                    {t("main.welcome.header.community.courses")}
                                </NavMenuLink>
                                <NavMenuLink
                                    className={styles.link}
                                    to="https://expedition.goodsurfing.org/"
                                >
                                    {t("main.welcome.header.expeditions", "Экспедиции")}
                                </NavMenuLink>
                                {/* <NavMenuLink
                                    className={styles.link}
                                    to={getMainPageUrl(locale)}
                                >
                                    {t("main.welcome.header.community.clubs")}
                                </NavMenuLink> */}
                                {/* <NavMenuLink
                                    className={styles.link}
                                    to={getJournalsPageUrl(locale)}
                                >
                                    {t("main.welcome.header.community.journal")}
                                </NavMenuLink> */}
                            </div>
                        </div>
                        <div className={styles.menu__item}>
                            <h4 className={styles.menu__title}>
                                {t("main.welcome.header.about-project.title")}
                            </h4>
                            <div className={styles.menu__content}>
                                <NavMenuLink
                                    className={styles.link}
                                    to={getNPOPageUrl(locale)}
                                >
                                    {t(
                                        "main.welcome.header.about-project.about-npo",
                                    )}
                                </NavMenuLink>
                                <NavMenuLink
                                    className={styles.link}
                                    to={getOurTeamPageUrl(locale)}
                                >
                                    {t(
                                        "main.welcome.header.about-project.our-team",
                                    )}
                                </NavMenuLink>
                                <NavMenuLink
                                    className={styles.link}
                                    to={getMembershipPageUrl(locale)}
                                >
                                    {t(
                                        "main.welcome.header.about-project.how-it-works",
                                    )}
                                </NavMenuLink>
                                <NavMenuLink
                                    className={styles.link}
                                    to={getRulesPageUrl(locale)}
                                >
                                    {t(
                                        "main.welcome.header.about-project.rules",
                                    )}
                                </NavMenuLink>
                                <NavMenuLink
                                    className={styles.link}
                                    to={getPrivacyPolicyPageUrl(locale)}
                                >
                                    {t(
                                        "main.welcome.header.about-project.privacy-policy",
                                    )}
                                </NavMenuLink>
                                <NavMenuLink
                                    className={styles.link}
                                    to={getNewsPageUrl(locale)}
                                >
                                    {t(
                                        "main.welcome.header.about-project.news",
                                    )}
                                </NavMenuLink>
                                <NavMenuLink
                                    className={styles.link}
                                    to={getAboutProjectPageUrl(locale)}
                                >
                                    {t(
                                        "main.welcome.header.about-project.about-goodsurfing",
                                    )}
                                </NavMenuLink>
                                <NavMenuLink
                                    className={styles.link}
                                    to={getFindJobPageUrl(locale)}
                                >
                                    {t(
                                        "main.welcome.header.about-project.find-job",
                                    )}
                                </NavMenuLink>
                                <NavMenuLink
                                    className={styles.link}
                                    to={getFeedbackPageUrl(locale)}
                                >
                                    {t(
                                        "main.welcome.header.about-project.feedback",
                                    )}
                                </NavMenuLink>
                            </div>
                        </div>
                        <div className={styles.menu__item}>
                            <h4 className={styles.menu__title}>
                                {t("main.welcome.header.for-organizers.title")}
                            </h4>
                            <div className={styles.menu__content}>
                                <NavMenuLink
                                    className={styles.link}
                                    to={getBecomeHostPageUrl(locale)}
                                >
                                    {t("main.welcome.header.for-organizers.become-a-host")}
                                </NavMenuLink>
                                {/* <NavMenuLink
                                    className={styles.link}
                                    to={getMainPageUrl(locale)}
                                >
                                    {t("main.welcome.header.for-organizers.courses-for-organizers")}
                                </NavMenuLink> */}
                            </div>
                        </div>
                        <div className={styles.menu__item}>
                            <h4 className={styles.menu__title}>
                                {t("main.welcome.header.donation.title")}
                            </h4>
                            <div className={styles.menu__content}>
                                <NavMenuLink
                                    className={styles.link}
                                    to={getMembershipPageUrl(locale)}
                                >
                                    {t("main.welcome.header.donation.support-goodsurfing")}
                                </NavMenuLink>
                                <NavMenuLink
                                    className={styles.link}
                                    to={getNPOPageUrl(locale)}
                                >
                                    {t("main.welcome.header.donation.public-reports")}
                                </NavMenuLink>
                                <a
                                    className={styles.link}
                                    href="/assets/docs/npo/Публичная_оферта.pdf"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {t("main.welcome.header.donation.public-offer")}
                                </a>
                                <NavMenuLink
                                    className={styles.link}
                                    to={getPaymentSecurityPolicyPageUrl(locale)}
                                >
                                    {t("main.welcome.header.donation.payment-security-policy")}
                                </NavMenuLink>
                            </div>
                        </div>
                    </nav>
                </div>
            </footer>
            <div className={styles.copyright}>
                <p>
                    © GoodSurfing, 2017-
                    {new Date().getFullYear()}
                </p>
                <div className={styles.copyright__links}>
                    <NavMenuLink
                        className={styles.copyright__link}
                        to={getRulesPageUrl(locale)}
                    >
                        {t("main.welcome.header.about-project.rules")}
                    </NavMenuLink>
                    <NavMenuLink
                        className={styles.copyright__link}
                        to={getPrivacyPolicyPageUrl(locale)}
                    >
                        {t("main.welcome.header.about-project.privacy-policy")}
                    </NavMenuLink>
                </div>
            </div>
        </>
    );
});
