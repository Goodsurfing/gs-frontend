import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { useLocale } from "@/app/providers/LocaleProvider";

import { ChangeLanguage } from "@/widgets/ChangeLanguage";

import fbIcon from "@/shared/assets/icons/footer/fb.svg";
import instaIcon from "@/shared/assets/icons/footer/instagram.svg";
import footerLogo from "@/shared/assets/icons/footer/logo.svg";
import tgIcon from "@/shared/assets/icons/footer/telegram.svg";
import vkIcon from "@/shared/assets/icons/footer/vk.svg";
import {
    getAboutProjectPageUrl,
    getBecomeHostPageUrl,
    getBlogPageUrl,
    getFindJobPageUrl,
    getJournalsPageUrl,
    getMainPageUrl,
    getMembershipPageUrl,
    getNPOPageUrl,
    getNewsPageUrl,
    getOurTeamPageUrl,
    getPrivacyPolicyPageUrl,
    getRulesPageUrl,
    getVideoPageUrl,
} from "@/shared/config/routes/AppUrls";

import styles from "./Footer.module.scss";
import { useUser } from "@/entities/Profile";

export const Footer = memo(() => {
    const { locale } = useLocale();
    const { t } = useTranslation();
    const { profile } = useUser();

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
                            <ChangeLanguage localeApi={profile?.locale} profileId={profile?.id} />
                        </div>
                        <div className={styles.socials}>
                            <a
                                href="https://www.instagram.com/goodsurfing"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <img src={instaIcon} alt="Instagram" />
                            </a>
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
                                href="https://www.facebook.com/goodsurfing"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <img src={fbIcon} alt="Facebook" />
                            </a>
                        </div>
                        <a
                            className={styles.write}
                            href="https://vk.com/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            {t("main.welcome.header.write-us")}
                        </a>
                    </div>

                    <nav className={styles.menu}>
                        <div className={styles.menu__item}>
                            <h4 className={styles.menu__title}>
                                {t("main.welcome.header.community.title")}
                            </h4>
                            <div className={styles.menu__content}>
                                <Link
                                    className={styles.link}
                                    to={getBlogPageUrl(locale)}
                                >
                                    {t("main.welcome.header.community.blog")}
                                </Link>
                                <Link
                                    className={styles.link}
                                    to={getVideoPageUrl(locale)}
                                >
                                    {t("main.welcome.header.community.video")}
                                </Link>
                                <Link
                                    className={styles.link}
                                    to={getMainPageUrl(locale)}
                                >
                                    {t("main.welcome.header.community.experts")}
                                </Link>
                                <Link
                                    className={styles.link}
                                    to={getMainPageUrl(locale)}
                                >
                                    {t(
                                        "main.welcome.header.community.ambassadors",
                                    )}
                                </Link>
                                <Link
                                    className={styles.link}
                                    to={getMainPageUrl(locale)}
                                >
                                    {t("main.welcome.header.community.courses")}
                                </Link>
                                <Link
                                    className={styles.link}
                                    to={getMainPageUrl(locale)}
                                >
                                    {t("main.welcome.header.community.clubs")}
                                </Link>
                                <Link
                                    className={styles.link}
                                    to={getJournalsPageUrl(locale)}
                                >
                                    {t("main.welcome.header.community.journal")}
                                </Link>
                            </div>
                        </div>
                        <div className={styles.menu__item}>
                            <h4 className={styles.menu__title}>
                                {t("main.welcome.header.about-project.title")}
                            </h4>
                            <div className={styles.menu__content}>
                                <Link
                                    className={styles.link}
                                    to={getNPOPageUrl(locale)}
                                >
                                    {t(
                                        "main.welcome.header.about-project.about-npo",
                                    )}
                                </Link>
                                <Link
                                    className={styles.link}
                                    to={getOurTeamPageUrl(locale)}
                                >
                                    {t(
                                        "main.welcome.header.about-project.our-team",
                                    )}
                                </Link>
                                <Link
                                    className={styles.link}
                                    to={getMembershipPageUrl(locale)}
                                >
                                    {t(
                                        "main.welcome.header.about-project.how-it-works",
                                    )}
                                </Link>
                                <Link
                                    className={styles.link}
                                    to={getRulesPageUrl(locale)}
                                >
                                    {t(
                                        "main.welcome.header.about-project.rules",
                                    )}
                                </Link>
                                <Link
                                    className={styles.link}
                                    to={getPrivacyPolicyPageUrl(locale)}
                                >
                                    {t(
                                        "main.welcome.header.about-project.privacy-policy",
                                    )}
                                </Link>
                                <Link
                                    className={styles.link}
                                    to={getNewsPageUrl(locale)}
                                >
                                    {t(
                                        "main.welcome.header.about-project.news",
                                    )}
                                </Link>
                                <Link
                                    className={styles.link}
                                    to={getAboutProjectPageUrl(locale)}
                                >
                                    {t(
                                        "main.welcome.header.about-project.about-goodsurfing",
                                    )}
                                </Link>
                                <Link
                                    className={styles.link}
                                    to={getFindJobPageUrl(locale)}
                                >
                                    {t(
                                        "main.welcome.header.about-project.find-job",
                                    )}
                                </Link>
                            </div>
                        </div>
                        <div className={styles.menu__item}>
                            <h4 className={styles.menu__title}>
                                {t("main.welcome.header.for-organizers.title")}
                            </h4>
                            <div className={styles.menu__content}>
                                <Link
                                    className={styles.link}
                                    to={getBecomeHostPageUrl(locale)}
                                >
                                    {t("main.welcome.header.for-organizers.become-a-host")}
                                </Link>
                                <Link
                                    className={styles.link}
                                    to={getMainPageUrl(locale)}
                                >
                                    {t("main.welcome.header.for-organizers.courses-for-organizers")}
                                </Link>
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
            </div>
        </>
    );
});
