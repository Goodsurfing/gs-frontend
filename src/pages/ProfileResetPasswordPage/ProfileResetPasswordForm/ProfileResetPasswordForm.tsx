import React, { FC } from "react";

import { authApi } from "store/api/authApi";
import { userInfoApi } from "store/api/userInfoApi";

import { Button, Variant } from "shared/ui/Button";

const ProfileResetPasswordForm: FC = () => {
  const [resetPasswordRequest, { isSuccess }] = authApi.useResetPasswordRequestMutation();
  const { data: userInfo, isSuccess: userInfoSuccess } = userInfoApi.useGetUserInfoQuery();

  const onSubmit: React.MouseEventHandler<HTMLButtonElement> = async () => {
    if (userInfoSuccess && userInfo) {
      await resetPasswordRequest({ email: userInfo.email });
    }
  };

  if (isSuccess) {
    return <h1>Заявка на восстановления пароля отправлена на почту!</h1>;
  }

  return (
      <Button onClick={onSubmit} type="submit" variant={Variant.PRIMARY}>
          Запросить ссылку
      </Button>
  );
};

export default ProfileResetPasswordForm;
