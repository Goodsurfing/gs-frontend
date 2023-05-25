import React, { FC } from "react";
import { Link } from "react-router-dom";

import ChangeLanguage from "widgets/ChangeLanguage/ChangeLanguage";

import fbIcon from "assets/icons/footer/fb.svg";
import instaIcon from "assets/icons/footer/instagram.svg";
import footerLogo from "assets/icons/footer/logo.svg";
import tgIcon from "assets/icons/footer/telegram.svg";
import vkIcon from "assets/icons/footer/vk.svg";

import styles from "./Footer.module.scss";

const Footer: FC = () => (
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
                        <Link
                            to="https://vk.com/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <img src={instaIcon} alt="Instagram" />
                        </Link>
                        <Link
                            to="https://vk.com/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <img src={tgIcon} alt="TelegrLink" />
                        </Link>
                        <Link
                            to="https://vk.com/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <img src={vkIcon} alt="VK" />
                        </Link>
                        <Link
                            to="https://vk.com/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <img src={fbIcon} alt="Facebook" />
                        </Link>
                    </div>
                    <Link
                        className={styles.write}
                        to="https://vk.com/"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Напишите нам
                    </Link>
                </div>

                <nav className={styles.menu}>
                    <div className={styles.menu__item}>
                        <h4 className={styles.menu__title}>Сообщество</h4>
                        <div className={styles.menu__content}>
                            <Link className={styles.link} to="">
                                Блог
                            </Link>
                            <Link className={styles.link} to="">
                                Видео
                            </Link>
                            <Link className={styles.link} to="">
                                Эксперты
                            </Link>
                            <Link className={styles.link} to="">
                                Амбассадоры
                            </Link>
                            <Link className={styles.link} to="">
                                Курсы
                            </Link>
                            <Link className={styles.link} to="">
                                Клубы
                            </Link>
                            <Link className={styles.link} to="">
                                Журнал
                            </Link>
                        </div>
                    </div>
                    <div className={styles.menu__item}>
                        <h4 className={styles.menu__title}>О проекте</h4>
                        <div className={styles.menu__content}>
                            <Link className={styles.link} to="">
                                О НКО
                            </Link>
                            <Link className={styles.link} to="">
                                Наша команда
                            </Link>
                            <Link className={styles.link} to="">
                                Как это работает
                            </Link>
                            <Link className={styles.link} to="">
                                Правила
                            </Link>
                            <Link className={styles.link} to="">
                                Политика конфиденциальности
                            </Link>
                            <Link className={styles.link} to="">
                                Новости
                            </Link>
                        </div>
                    </div>
                    <div className={styles.menu__item}>
                        <h4 className={styles.menu__title}>
                            Для организаторов
                        </h4>
                        <div className={styles.menu__content}>
                            <Link className={styles.link} to="">
                                Стать хостом
                            </Link>
                            <Link className={styles.link} to="">
                                Как это работае
                            </Link>
                            <Link className={styles.link} to="">
                                Правила
                            </Link>
                            <Link className={styles.link} to="">
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

export default Footer;
