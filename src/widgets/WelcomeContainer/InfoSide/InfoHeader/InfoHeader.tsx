import React, { FC, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import Popup from "components/Popup/Popup";
import { logout } from "store/reducers/loginSlice";

import ChangeLanguage from "widgets/ChangeLanguage/ChangeLanguage";
import MobileHeader from "widgets/MobileHeader/MobileHeader";

import { AppRoutes } from "shared/config/RouteConfig/RouteConfig";
import { useAppDispatch, useAppSelector } from "shared/hooks/redux";
import { useOnClickOutside } from "shared/hooks/useOnClickOutside";
import Arrow from "shared/ui/Arrow/Arrow";
import Button from "shared/ui/Button/Button";
import { Variant } from "shared/ui/Button/ui/Button.interface";
import ButtonLink from "shared/ui/ButtonLink/ButtonLink";

import LocaleLink from "shared/ui/LocaleLink/ui/LocaleLink";

import styles from "./InfoHeader.module.scss";

const InfoHeader: FC = () => {
  const { t } = useTranslation();

  const [linkIsOpen, setLinkIsOpen] = useState<boolean>(false);

  const { token } = useAppSelector((state) => state.login);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  const communityRef = useRef(null);

  const handleClickOutside = () => {
    setLinkIsOpen(false);
  };

  useOnClickOutside(communityRef, handleClickOutside);

  return (
      <>
          <div className={styles.mobile__header__wrapper}>
              <MobileHeader />
          </div>
          <header className={styles.header}>
              <ChangeLanguage />
              <div className={styles.link}>
                  <Link to="">{t("main.welcome.header.how-it-work")}</Link>
              </div>
              <div
                  ref={communityRef}
                  className={styles.link}
                  onClick={() => setLinkIsOpen(!linkIsOpen)}
              >
                  <p>{t("main.welcome.header.community.title")}</p>
                  <Arrow isOpen={linkIsOpen} />
                  <Popup isOpen={linkIsOpen} className={styles.popup}>
                      <Link to={AppRoutes.MAIN}>
                          {t("main.welcome.header.community.blog")}
                      </Link>
                      <Link to={AppRoutes.MAIN}>
                          {t("main.welcome.header.community.video")}
                      </Link>
                      <Link to={AppRoutes.MAIN}>
                          {t("main.welcome.header.community.experts")}
                      </Link>
                      <Link to={AppRoutes.MAIN}>
                          {t("main.welcome.header.community.ambassadors")}
                      </Link>
                      <Link to={AppRoutes.MAIN}>
                          {t("main.welcome.header.community.courses")}
                      </Link>
                      <Link to={AppRoutes.MAIN}>
                          {t("main.welcome.header.community.clubs")}
                      </Link>
                      <Link to={AppRoutes.MAIN}>
                          {t("main.welcome.header.community.journal")}
                      </Link>
                  </Popup>
              </div>
              {token ? (
                  <>
                      <div className={styles.link}>
                          <Link to={AppRoutes.PROFILE}>
                              Личный кабинет
                          </Link>
                      </div>
                      <div className={styles.link}>
                          <Button
                              onClick={() => handleLogout()}
                              className={styles.btn}
                              variant={Variant.PRIMARY}
                          >
                              {t("main.welcome.header.exit")}
                          </Button>
                      </div>
                  </>
              ) : (
                  <>
                      <div className={styles.link}>
                          <LocaleLink to={AppRoutes.SIGN_IN}>
                              {t("main.welcome.header.sign-in")}
                          </LocaleLink>
                      </div>
                      <div className={styles.link}>
                          <ButtonLink
                              className={styles.btn}
                              type="outlined"
                              path={AppRoutes.SIGN_UP}
                          >
                              {t("main.welcome.header.sign-up")}
                          </ButtonLink>
                      </div>
                  </>
              )}
          </header>
      </>
  );
};

export default InfoHeader;
