import { FC } from "react";
import { useTranslation } from "react-i18next";

import { AuthForm as SignInForm } from "features/AuthByEmail";

import { SignInNotRegistered } from "../SignInNotRegistered/SignInNotRegistred";
import { SignInTitle } from "../SignInTitle/SignInTitle";

import styles from "./AuthForm.module.scss";

export const SignIn: FC = () => {
  const { t } = useTranslation();
  return (
      <div className={styles.wrapper}>
          <SignInTitle>{t("sing-in.sign-in")}</SignInTitle>
          <SignInForm />
          <SignInNotRegistered />
      </div>
  );
};
