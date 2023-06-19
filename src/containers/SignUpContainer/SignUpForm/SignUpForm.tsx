import i18n from 'i18next';
import React, { FC, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import InputField from 'components/InputField/InputField';
import Button from 'components/ui/Button/Button';
import { Variant } from 'components/ui/Button/Button.interface';

import { useAppDispatch, useAppSelector } from 'hooks/redux';

import { AppRoutesEnum } from 'routes/types';

import { authApi } from 'store/api/authApi';
import { setRegisterUserData } from 'store/reducers/registerSlice';

import { IAuthFormData } from 'types/api/auth/register.interface';

import styles from './SignUpForm.module.scss';
import HintPopup from 'components/HintPopup/HintPopup';
import { IToast } from 'store/reducers/toastSlice';
import { HintType } from 'components/HintPopup/HintPopup.interface';

const SignUpForm: FC = () => {
  const [registerUser, { isError }] = authApi.useRegisterUserMutation();

  const [toast, setToast] = useState<IToast>();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { control, reset, handleSubmit } = useForm<IAuthFormData>({
    mode: 'onChange',
  });

  const onSubmit: SubmitHandler<IAuthFormData> = async (data) => {
    try {
      await registerUser({ ...data, locale: 'ru' })
        .unwrap()
        .then((response) => {
          dispatch(setRegisterUserData(response));
          navigate(
            `/${i18n.language}/${AppRoutesEnum.CONFIRM_EMAIL}`,
            { replace: true },
          );
        })
        .catch((err) => {
          console.error('error');
          setToast({
            text: 'Некорректно введены данные',
            type: HintType.Error,
          });
        });
    } catch (e) {
      console.log();
    }
    reset();
  };

  return (
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {isError && toast && <HintPopup text={toast.text} type={toast.type} />}
          <Controller
              control={control}
              name="email"
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
          <Button
              type="submit"
              variant={Variant.PRIMARY}
              className={styles.btn}
          >
              Зарегистрироваться
          </Button>
      </form>
  );
};

export default SignUpForm;
