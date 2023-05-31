import { useTranslation } from "react-i18next";

import { Button, Variant } from "shared/ui/Button";

import Age from "../Age/Age";
import Gender from "../Gender/Gender";
import LanguagesGroup from "../LanguagesGroup/LanguagesGroup";
import Location from "../Location/Location";

import styles from "./WhoNeedsForm.module.scss";

export const WhoNeedsForm = () => {
  const { t } = useTranslation();
  return (
      <form className={styles.wrapper}>
          <Gender />
          <Age />
          <LanguagesGroup />
          <Location />
          <Button
              onClick={() => {}}
              className={styles.btn}
              rounded
              variant={Variant.PRIMARY}
          >
              {t("save")}
          </Button>
      </form>
  );
};
