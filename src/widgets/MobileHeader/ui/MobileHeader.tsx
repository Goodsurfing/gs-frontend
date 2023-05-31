import mobileLogotype from "assets/icons/mobile-header-logo.svg";
import cn from "classnames";
import React, { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { AppRoutes } from "app/router";

import { SwitchLanguage } from "features/SwitchLanguage";

import { useAppSelector } from "shared/hooks/redux";

import styles from "./MobileHeader.module.scss";

export const MobileHeader: FC = () => {
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

              <SwitchLanguage />
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
                  <Link to={AppRoutes.MAIN}>{t("main.welcome.header.how-it-work")}</Link>
              </div>
              <div className={styles.link}>
                  <Link to={AppRoutes.MAIN}>
                      {t("main.welcome.header.community.title")}
                  </Link>
              </div>
              <div className={styles.link}>
                  {token ? (
                      <Link to={AppRoutes.MAIN}>Категории</Link>
                  ) : (
                      <Link to={AppRoutes.SIGN_IN}>
                          {t("main.welcome.header.sign-in")}
                      </Link>
                  )}
              </div>
              <div className={styles.link}>
                  <Link to={AppRoutes.SIGN_UP}>
                      {t("main.welcome.header.sign-up")}
                  </Link>
              </div>
          </div>
      </>
  );
};
