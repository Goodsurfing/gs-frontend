import i18next from "i18next";
import { FC, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { AppRoutes } from "app/router";

import { getUserAuthData, userActions } from "entities/User";

import { USER_LOCALSTORAGE_KEY } from "shared/constants/localstorage";
import { useAppDispatch } from "shared/hooks/redux";
import { Button, Variant } from "shared/ui/Button";
import { Checkbox } from "shared/ui/Checkbox";
import { InputField } from "shared/ui/InputField";
import { LocaleLink } from "shared/ui/LocaleLink";

import { useLoginUserMutation } from "../../model/api/loginApi";
import type { LoginSchema } from "../../model/types/loginSchema";

import styles from "./AuthForm.module.scss";

export const AuthForm: FC = () => {
  const { t } = useTranslation();

  const [isRemember, setIsRemember] = useState(true);

  const [loginUser, { isError }] = useLoginUserMutation();

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const handleCheckboxClick = () => {
    setIsRemember((prev) => !prev);
  };

  const { control, reset, handleSubmit } = useForm({ mode: "onChange" });

  const { email } = useSelector(getUserAuthData);

  const onSubmit: SubmitHandler<LoginSchema> = async (data) => {
    loginUser(data).unwrap().then((res) => {
      const authData = {
        token: res.token,
        email,
      };
      dispatch(userActions.setAuthData(authData));
      localStorage.setItem(USER_LOCALSTORAGE_KEY, JSON.stringify(authData));
      navigate(`/${i18next.language}/`);
      reset();
    }).catch((error) => {
      throw new Error(error);
    });
  };

  return (
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          { isError && "Ошибка авторизации" }
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
