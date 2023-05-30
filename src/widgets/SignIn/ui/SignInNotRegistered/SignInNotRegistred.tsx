import { FC } from "react";
import { useTranslation } from "react-i18next";

import { AppRoutes } from "app/router";

import { LocaleLink } from "shared/ui/LocaleLink";

import styles from "./SignInNotRegistered.module.scss";

interface SignInNotRegisteredProps {}

export const SignInNotRegistered: FC<SignInNotRegisteredProps> = () => {
  const { t } = useTranslation();

  return (
      <div className={styles.redirect}>
          {t("havent-registered")}
          <LocaleLink to={AppRoutes.SIGN_UP}>
              {t("sign-in.sign-up")}
          </LocaleLink>
      </div>
  );
};
