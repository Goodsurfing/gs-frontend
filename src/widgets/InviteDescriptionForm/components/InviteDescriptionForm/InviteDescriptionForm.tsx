import React from "react";

import Button from "shared/ui/Button/Button";
import { Variant } from "shared/ui/Button/ui/Button.interface";

import Categories from "../Categories/Categories";
import EventName from "../EventName/EventName";
import ExtraImagesUpload from "../ExtraImagesUpload/ExtraImagesUpload";
import FullDescription from "../FullDescription/FullDescription";
import ImageUpload from "../ImageUpload/ImageUpload";
import ShortDescription from "../ShortDescription/ShortDescription";

import styles from "./InviteDescriptionForm.module.scss";

export const InviteDescriptionForm = () => {
  const onSubmit = () => {};
  return (
      <form onSubmit={onSubmit}>
          <div className={styles.formWrapper}>
              <EventName />
              <Categories />
              <ShortDescription />
              <FullDescription />
              <ImageUpload />
              <ExtraImagesUpload />
          </div>
          <Button className={styles.btn} rounded variant={Variant.PRIMARY}>Сохранить</Button>
      </form>
  );
};
