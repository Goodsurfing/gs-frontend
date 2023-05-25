import cn from "classnames";
import React, { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import ChangeLanguage from "widgets/ChangeLanguage/ChangeLanguage";

import { useAppSelector } from "hooks/redux";

import { AppRoutesEnum } from "routes/types";

import mobileLogotype from "assets/icons/mobile-header-logo.svg";

import styles from "./MobileHeader.module.scss";

const MobileHeader: FC = () => {
  const { t } = useTranslation();
  const { token } = useAppSelector((state) => state.login);

  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);

  return (
      <>
          <header className={styles.header}>
              <Link to="/">
                  <img
                      src={mobileLogotype}
                      alt="GoodSurfing"
                      className={styles.logo}
                  />
              </Link>

              <ChangeLanguage />
              <div
                  className={cn(styles.burger, {
                    [styles.open]: menuIsOpen,
                  })}
                  onClick={() => setMenuIsOpen(!menuIsOpen)}
              >
                  <span />
                  <span />
                  <span />
              </div>
          </header>

          <div
              className={cn(styles.menu, {
                [styles.active]: menuIsOpen,
              })}
          >
              <div className={styles.link}>
                  <Link to="">{t("main.welcome.header.how-it-work")}</Link>
              </div>
              <div className={styles.link}>
                  <Link to="">
                      {t("main.welcome.header.community.title")}
                  </Link>
              </div>
              <div className={styles.link}>
                  {token ? (
                      <Link to={AppRoutesEnum.CATEGORIES}>Категории</Link>
                  ) : (
                      <Link to={AppRoutesEnum.SIGNIN}>
                          {t("main.welcome.header.sign-in")}
                      </Link>
                  )}
              </div>
              <div className={styles.link}>
                  <Link to={AppRoutesEnum.SIGNUP}>
                      {t("main.welcome.header.sign-up")}
                  </Link>
              </div>
          </div>
      </>
  );
};

export default MobileHeader;
