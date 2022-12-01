import React, {FC} from 'react';
import SignLayout from "@/components/ui/SignLayout/SignLayout";
import {AppRoutesEnum} from "@/routes/types";

import styles from "./SignInPage.module.scss";

const SignInPage: FC = () => {

  return (
      <SignLayout
          cancelPath={AppRoutesEnum.HOME}
          cancelText={"Отменить"}
      >
        <div className={styles.wrapper}>
        </div>
      </SignLayout>
  );
};

export default SignInPage;
