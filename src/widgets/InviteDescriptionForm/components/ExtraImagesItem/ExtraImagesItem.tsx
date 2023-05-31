import React, { FC } from "react";

import ImageInput from "components/ImageInput/ImageInput";

import styles from "./ExtraImagesItem.module.scss";
import ExtraImagesItemBackground from "./ExtraImagesItemBackground/ExtraImagesItemBackground";
import ExtraImagesItemButton from "./ExtraImagesItemButton/ExtraImagesItemButton";
import { ExtraImagesItemProps } from "./types";

const ExtraImagesItem: FC<ExtraImagesItemProps> = ({
  img, setImg, id, closeBtn,
}) => {
  const onBtnClick = () => {};

  return (
      <div className={styles.wrapper}>
          <ImageInput
              id={id}
              img={img}
              setImg={setImg}
              className={styles.main}
              wrapperClassName={styles.background}
              labelClassName={styles.label}
              labelChildren={!img && <ExtraImagesItemBackground />}
          />
          {closeBtn && <ExtraImagesItemButton className={styles.closeBtn} onClick={onBtnClick} />}
      </div>

  );
};

export default React.memo(ExtraImagesItem);