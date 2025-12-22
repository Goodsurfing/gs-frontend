import React, { FC } from "react";
import ImageInput from "@/components/ImageInput/ImageInput";

import styles from "./ExtraImagesItem.module.scss";
import ExtraImagesItemBackground from "./ExtraImagesItemBackground/ExtraImagesItemBackground";
import ExtraImagesItemButton from "./ExtraImagesItemButton/ExtraImagesItemButton";
import { ExtraImagesItemProps } from "./types";
import { getMediaContent } from "@/shared/lib/getMediaContent";

const ExtraImagesItem: FC<ExtraImagesItemProps> = ({
    img,
    setImg,
    onDelete,
    id,
    closeBtn,
    label,
    checkImageSize,
    onError,
    onSuccess,
}) => {
    const onBtnClick = () => {};

    return (
        <div className={styles.wrapper}>
            <ImageInput
                id={id}
                img={getMediaContent(img.contentUrl)}
                setImg={setImg}
                onDelete={onDelete}
                className={styles.main}
                wrapperClassName={styles.background}
                labelClassName={styles.label}
                labelChildren={
                    !img && <ExtraImagesItemBackground label={label} />
                }
                checkImageSize={checkImageSize}
                onError={onError}
                onSuccess={onSuccess}
            />
            {closeBtn && (
                <ExtraImagesItemButton
                    className={styles.closeBtn}
                    onClick={onBtnClick}
                />
            )}
        </div>
    );
};

export default React.memo(ExtraImagesItem);
