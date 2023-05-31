import { FC } from "react";

import { AppRoutes } from "app/router";

import { SignLayout } from "widgets/SignLayout";

import { useAppSelector } from "shared/hooks/redux";
import { SignTitle } from "shared/ui/SignTitle";

import styles from "./ConfirmEmailPage.module.scss";

const ConfirmEmailPage: FC = () => {
  const { email } = useAppSelector((state) => state.register);

  return (
      <SignLayout cancelText="Отменить" cancelPath={AppRoutes.SIGN_UP}>
          <div className={styles.wrapper}>
              <SignTitle>Регистрация пользователя</SignTitle>
              <div className={styles.content}>
                  <div className={styles.notification}>
                      На
                      <span>{email}</span>
                      было отправлено письмо со
                      ссылкой для подтверждения почты.
                  </div>
                  <p>
                      Если вы не видите письмо, проверьте, не попало ли оно в
                      папку «Спам».
                  </p>
              </div>
          </div>
      </SignLayout>
  );
};

export default ConfirmEmailPage;
