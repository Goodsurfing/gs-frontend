import React, { FC } from "react";

import ImageInput from "@/components/ImageInput/ImageInput";

import ExtraImagesItemBackground from "./ExtraImagesItemBackground/ExtraImagesItemBackground";
import ExtraImagesItemButton from "./ExtraImagesItemButton/ExtraImagesItemButton";

import { ExtraImagesItemProps } from "./types";

import styles from "./ExtraImagesItem.module.scss";

const ExtraImagesItem: FC<ExtraImagesItemProps> = ({
    img, setImg, id, closeBtn, label,
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
                labelChildren={!img && <ExtraImagesItemBackground label={label} />}
            />
            {closeBtn && <ExtraImagesItemButton className={styles.closeBtn} onClick={onBtnClick} />}
        </div>

    );
};

export default React.memo(ExtraImagesItem);
