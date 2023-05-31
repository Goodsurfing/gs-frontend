import { FC } from "react";
import { useTranslation } from "react-i18next";

import { Button, Variant } from "shared/ui/Button";

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
