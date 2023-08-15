import { memo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useLocale } from "@/app/providers/LocaleProvider";

import { ChangeLanguage } from "@/widgets/ChangeLanguage";

import fbIcon from "@/shared/assets/icons/footer/fb.svg";
import instaIcon from "@/shared/assets/icons/footer/instagram.svg";
import footerLogo from "@/shared/assets/icons/footer/logo.svg";
import tgIcon from "@/shared/assets/icons/footer/telegram.svg";
import vkIcon from "@/shared/assets/icons/footer/vk.svg";

import styles from "./Footer.module.scss";
import { getMainPageUrl } from "@/shared/config/routes/AppUrls";

export const Footer = memo(() => {
    const { locale } = useLocale();
    const { t } = useTranslation();
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
                            <ChangeLanguage />
                        </div>
                        <div className={styles.socials}>
                            <a
                                href="https://vk.com/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <img src={instaIcon} alt="Instagram" />
                            </a>
                            <a
                                href="https://vk.com/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <img src={tgIcon} alt="Telegram" />
                            </a>
                            <a
                                href="https://vk.com/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <img src={vkIcon} alt="VK" />
                            </a>
                            <a
                                href="https://vk.com/"
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
                            Напишите нам
                        </a>
                    </div>

                    <nav className={styles.menu}>
                        <div className={styles.menu__item}>
                            <h4 className={styles.menu__title}>Сообщество</h4>
                            <div className={styles.menu__content}>
                                <Link className={styles.link} to={getMainPageUrl(locale)}>
                                    Блог
                                </Link>
                                <Link className={styles.link} to={getMainPageUrl(locale)}>
                                    Видео
                                </Link>
                                <Link className={styles.link} to={getMainPageUrl(locale)}>
                                    Эксперты
                                </Link>
                                <Link className={styles.link} to={getMainPageUrl(locale)}>
                                    Амбассадоры
                                </Link>
                                <Link className={styles.link} to={getMainPageUrl(locale)}>
                                    Курсы
                                </Link>
                                <Link className={styles.link} to={getMainPageUrl(locale)}>
                                    Клубы
                                </Link>
                                <Link className={styles.link} to={getMainPageUrl(locale)}>
                                    Журнал
                                </Link>
                            </div>
                        </div>
                        <div className={styles.menu__item}>
                            <h4 className={styles.menu__title}>О проекте</h4>
                            <div className={styles.menu__content}>
                                <Link className={styles.link} to={getMainPageUrl(locale)}>
                                    О НКО
                                </Link>
                                <Link className={styles.link} to={getMainPageUrl(locale)}>
                                    Наша команда
                                </Link>
                                <Link className={styles.link} to={getMainPageUrl(locale)}>
                                    Как это работает
                                </Link>
                                <Link className={styles.link} to={getMainPageUrl(locale)}>
                                    Правила
                                </Link>
                                <Link className={styles.link} to={getMainPageUrl(locale)}>
                                    Политика конфиденциальности
                                </Link>
                                <Link className={styles.link} to={getMainPageUrl(locale)}>
                                    Новости
                                </Link>
                            </div>
                        </div>
                        <div className={styles.menu__item}>
                            <h4 className={styles.menu__title}>
                                Для организаторов
                            </h4>
                            <div className={styles.menu__content}>
                                <Link className={styles.link} to={getMainPageUrl(locale)}>
                                    Стать хостом
                                </Link>
                                <Link className={styles.link} to={getMainPageUrl(locale)}>
                                    Как это работает
                                </Link>
                                <Link className={styles.link} to={getMainPageUrl(locale)}>
                                    Правила
                                </Link>
                                <Link className={styles.link} to={getMainPageUrl(locale)}>
                                    Курсы для организаторов
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
