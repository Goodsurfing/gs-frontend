import React, {
    ChangeEvent, FC, useCallback, useState,
} from "react";

import { useTranslation } from "react-i18next";
import cameraIcon from "@/shared/assets/icons/photo-camera.svg";
import Button from "@/shared/ui/Button/Button";
import InputFile from "@/shared/ui/InputFile/InputFile";

import styles from "./UploadArticleCover.module.scss";

interface UploadArticleCoverProps {
    id: string;
    onUpload?: (img: File) => void;
}

export const UploadArticleCover: FC<UploadArticleCoverProps> = (
    props: UploadArticleCoverProps,
) => {
    const { id, onUpload } = props;
    const [img, setImg] = useState<string | null>(null);
    const { t } = useTranslation("volunteer");

    const handleUpload = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const fileList = e.target.files;
            if (fileList && fileList.length > 0) {
                const file = fileList[0];
                // console.log(file);
                const url = URL.createObjectURL(file);
                setImg(url);
                onUpload?.(file);
            }
        },
        [onUpload],
    );

    const handleDelete = () => {
        setImg(null);
    };

    return (
        <div className={styles.wrapper}>
            {img && (
                <div className={styles.imageWrapper}>
                    <img src={img} alt="uploaded" className={styles.imageCover} />
                    <div className={styles.containerButtons}>
                        <InputFile
                            id="upload image"
                            onChange={handleUpload}
                            wrapperClassName={styles.inputButton}
                            uploadedImageClassName={styles.hiddenImg}
                            labelClassName={styles.inputButton}
                            labelChildren={(
                                <div
                                    className={styles.buttons}
                                >
                                    {t("volunteer-create-article.Изменить")}
                                </div>
                            )}
                        />
                        <Button
                            className={styles.buttons}
                            color="BLUE"
                            size="SMALL"
                            variant="OUTLINE"
                            onClick={handleDelete}
                        >
                            {t("volunteer-create-article.Удалить")}
                        </Button>
                    </div>
                </div>
            )}
            {!img
            && (
                <InputFile
                    onChange={handleUpload}
                    imageURL={img}
                    id={id}
                    uploadedImageClassName={styles.hiddenImg}
                    labelClassName={styles.btn}
                    labelChildren={(
                        <div className={styles.innerWrapper}>
                            <img
                                src={cameraIcon}
                                alt="add item"
                            />
                            <span className={styles.text}>{t("volunteer-create-article.Добавить фото обложки")}</span>
                        </div>
                    )}
                />
            )}
        </div>
    );
};
