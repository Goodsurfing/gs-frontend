import { useAppDispatch } from "hooks/redux";
import i18n from "i18next";
import tokenStorage from "lib/storage/TokenStorage";
import React, { FC, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AppRoutesEnum } from "routes/types";
import { IAuthLoginData } from "types/api/auth/login.interface";

import Checkbox from "components/Checkbox/Checkbox";
import HintPopup from "components/HintPopup/HintPopup";
import { HintType } from "components/HintPopup/HintPopup.interface";
import InputField from "components/InputField/InputField";
import { authApi } from "store/api/authApi";
import { setLoginUserData } from "store/reducers/loginSlice";
import { IToast } from "store/reducers/toastSlice";

import Button from "shared/ui/Button/Button";
import { Variant } from "shared/ui/Button/ui/Button.interface";
import LocaleLink from "shared/ui/LocaleLink/ui/LocaleLink";

import styles from "./SignInForm.module.scss";

const SignInForm: FC = () => {
  const [loginUser, { isError }] = authApi.useLoginUserMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [toast, setToast] = useState<IToast>();

  const [isRemember, setIsRemember] = useState<boolean>(true);
  const { control, reset, handleSubmit } = useForm<IAuthLoginData>({
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<IAuthLoginData> = async (data) => {
    loginUser(data)
      .unwrap()
      .then((res) => {
        dispatch(setLoginUserData(res));
        tokenStorage.setToken(res.token);
        navigate(`/${i18n.language}/`);
        reset();
      })
      .catch((err) => {
        console.error("Неверные данные");
        setToast({
          text: "Неверный логин или пароль",
          type: HintType.Error,
        });
      });
  };

  const checkboxHandleClick = () => {
    setIsRemember(!isRemember);
  };

  return (
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {isError && toast && (
          <HintPopup type={HintType.Error} text="Произошла ошибка" />
          )}
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
              Войти
          </Button>

          <div className={styles.help}>
              <Checkbox
                  isChecked={isRemember}
                  onChange={checkboxHandleClick}
                  text="Запомнить меня"
              />
              <LocaleLink
                  to={AppRoutesEnum.RESET_PASSWORD}
                  className={styles.forget}
              >
                  Забыли пароль?
              </LocaleLink>
          </div>
      </form>
  );
};

export default SignInForm;
