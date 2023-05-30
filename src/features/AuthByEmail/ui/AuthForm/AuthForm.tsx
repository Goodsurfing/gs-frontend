import { FC, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { AppRoutes } from "app/router";

import { Button, Variant } from "shared/ui/Button";
import { Checkbox } from "shared/ui/Checkbox";
import { InputField } from "shared/ui/InputField";
import { LocaleLink } from "shared/ui/LocaleLink";

import styles from "./AuthForm.module.scss";

export const AuthForm: FC = () => {
  const { t } = useTranslation();

  const [isRemember, setIsRemember] = useState(true);

  const navigate = useNavigate();

  const handleCheckboxClick = () => {
    setIsRemember((prev) => !prev);
  };

  const { control, handleSubmit } = useForm({ mode: "onChange" });

  const onSubmit: SubmitHandler = () => {

  };

  return (
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <Controller
              control={control}
              name="username"
              defaultValue=""
              render={({ field }) => (
                  <InputField
                      onChange={(e) => field.onChange(e)}
                      value={field.value}
                      type="email"
                      text="E-mail"
                  />
              )}
          />
          <Controller
              control={control}
              name="password"
              defaultValue=""
              render={({ field }) => (
                  <InputField
                      onChange={(e) => field.onChange(e)}
                      value={field.value}
                      type="password"
                      text="Пароль"
                  />
              )}
          />
          <Button type="submit" variant={Variant.SECONDARY}>
              {t("sign-in")}
          </Button>

          <div className={styles.help}>
              <Checkbox
                  isChecked={isRemember}
                  onChange={handleCheckboxClick}
              >
                  {t("remember-me")}
              </Checkbox>
              <LocaleLink
                  to={AppRoutes.RESET_PASSWORD}
                  className={styles.forget}
              >
                  {t("forgot-password")}
              </LocaleLink>
          </div>
      </form>
  );
};
