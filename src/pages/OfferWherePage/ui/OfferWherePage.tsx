import Button from "shared/ui/Button/Button";
import { Variant } from "shared/ui/Button/ui/Button.interface";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import YMapWithAddress from "components/Ymaps/YMapWithAddress/YMapWithAddress";

import styles from "./OfferWherePage.module.scss";

export interface IOfferWherePageForm {
    address: string;
}

const OfferWherePage = () => {
  const onSubmit: SubmitHandler<IOfferWherePageForm> = async (data) => {
    console.log(data);
  };

  const { control, handleSubmit } = useForm<IOfferWherePageForm>({
    mode: "onChange",
  });

  return (
      <div className={styles.wrapper}>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
              <div className={styles.ymaps}>
                  <YMapWithAddress
                      width="300px"
                      height="300px"
                      data={{ address: "" }}
                      control={control}
                  />
              </div>
              <Button
                  rounded
                  variant={Variant.PRIMARY}
                  className={styles.btn}
              >
                  Сохранить
              </Button>
          </form>
      </div>
  );
};

export default OfferWherePage;
