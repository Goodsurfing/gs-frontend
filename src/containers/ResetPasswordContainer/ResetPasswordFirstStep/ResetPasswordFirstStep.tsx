import React, { FC } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import InputField from 'components/InputField/InputField';
import Button from 'components/ui/Button/Button';
import { Variant } from 'components/ui/Button/Button.interface';

import { authApi } from 'store/api/authApi';

import { IResetPasswordRequestFormData } from 'types/api/auth/resetPassword.interface';

import styles from './ResetPasswordFirstStep.module.scss';

interface ResetPasswordFirstStepProps {
    changeStep: (email: string) => void;
}

const ResetPasswordFirstStep: FC<ResetPasswordFirstStepProps> = ({
  changeStep,
}) => {
  const { control, reset, handleSubmit } = useForm<IResetPasswordRequestFormData>({
    mode: 'onChange',
  });

  const [resetPasswordRequest] = authApi.useResetPasswordRequestMutation();

  const onSubmit: SubmitHandler<IResetPasswordRequestFormData> = async (
    data,
  ) => {
    await resetPasswordRequest(data)
      .unwrap()
      .then((response) => {
        changeStep(response.email);
        reset();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
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
          <Button type="submit" variant={Variant.PRIMARY}>
              Отправить
          </Button>
      </form>
  );
};

export default ResetPasswordFirstStep;
