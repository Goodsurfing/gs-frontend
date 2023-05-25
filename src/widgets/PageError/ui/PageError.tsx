import { FC } from "react";

import { useTranslation } from "react-i18next";

import Button from "shared/ui/Button/Button";

import { Variant } from "shared/ui/Button/Button.interface";
import styles from "./PageError.module.scss";

export const PageError: FC = () => {
  const { t } = useTranslation();

  const reloadPage = () => {
    window.location.reload();
  };

  return (
      <div className={styles.pageError}>
          <p className={styles.text}>{t("Произошла непредвиденная ошибка")}</p>
          <Button variant={Variant.PRIMARY} onClick={reloadPage}>
              {t("Произошла ошибка")}
          </Button>
      </div>
  );
};
