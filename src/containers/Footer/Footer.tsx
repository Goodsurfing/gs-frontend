import React, { FC } from "react";
import { Link } from "react-router-dom";

import ChangeLanguage from "@/components/ChangeLanguage/ChangeLanguage";

import fbIcon from "@/assets/icons/footer/fb.svg";
import instaIcon from "@/assets/icons/footer/instagram.svg";
import footerLogo from "@/assets/icons/footer/logo.svg";
import tgIcon from "@/assets/icons/footer/telegram.svg";
import vkIcon from "@/assets/icons/footer/vk.svg";

import styles from "./Footer.module.scss";

const Footer: FC = () => {
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
                            ???????????????? ??????
                        </a>
                    </div>

                    <nav className={styles.menu}>
                        <div className={styles.menu__item}>
                            <h4 className={styles.menu__title}>????????????????????</h4>
                            <div className={styles.menu__content}>
                                <Link className={styles.link} to="/">
                                    ????????
                                </Link>
                                <Link className={styles.link} to="/">
                                    ??????????
                                </Link>
                                <Link className={styles.link} to="/">
                                    ????????????????
                                </Link>
                                <Link className={styles.link} to="/">
                                    ??????????????????????
                                </Link>
                                <Link className={styles.link} to="/">
                                    ??????????
                                </Link>
                                <Link className={styles.link} to="/">
                                    ??????????
                                </Link>
                                <Link className={styles.link} to="/">
                                    ????????????
                                </Link>
                            </div>
                        </div>
                        <div className={styles.menu__item}>
                            <h4 className={styles.menu__title}>?? ??????????????</h4>
                            <div className={styles.menu__content}>
                                <Link className={styles.link} to="/">
                                    ?? ??????
                                </Link>
                                <Link className={styles.link} to="/">
                                    ???????? ??????????????
                                </Link>
                                <Link className={styles.link} to="/">
                                    ?????? ?????? ????????????????
                                </Link>
                                <Link className={styles.link} to="/">
                                    ??????????????
                                </Link>
                                <Link className={styles.link} to="/">
                                    ???????????????? ????????????????????????????????????
                                </Link>
                                <Link className={styles.link} to="/">
                                    ??????????????
                                </Link>
                            </div>
                        </div>
                        <div className={styles.menu__item}>
                            <h4 className={styles.menu__title}>
                                ?????? ??????????????????????????
                            </h4>
                            <div className={styles.menu__content}>
                                <Link className={styles.link} to="/">
                                    ?????????? ????????????
                                </Link>
                                <Link className={styles.link} to="/">
                                    ?????? ?????? ??????????????
                                </Link>
                                <Link className={styles.link} to="/">
                                    ??????????????
                                </Link>
                                <Link className={styles.link} to="/">
                                    ?????????? ?????? ??????????????????????????
                                </Link>
                            </div>
                        </div>
                    </nav>
                </div>
            </footer>
            <div className={styles.copyright}>
                <p>
                    ?? GoodSurfing, 2017-
                    {new Date().getFullYear()}
                </p>
            </div>
        </>
    );
};

export default Footer;
