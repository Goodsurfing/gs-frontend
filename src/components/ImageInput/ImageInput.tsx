import cn from "classnames";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import { CircularProgress } from "@mui/material";
import Button from "@/shared/ui/Button/Button";
import InputFile from "@/shared/ui/InputFile/InputFile";
import { checkWidthAndHeight } from "@/shared/utils/files/checkWidthAndHeight";

import styles from "./ImageInput.module.scss";
import { ImageInputComponentProps } from "./types";

const ImageInput: FC<ImageInputComponentProps> = ({
    img,
    setImg,
    id,
    description,
    extraWrapperClassName,
    labelChildren,
    wrapperClassName,
    isLoading,
    labelClassName,
    checkImageSize = true,
    onError,
    onSuccess,
    ...restInputProps
}) => {
    const { t } = useTranslation("offer");

    const handleUpload = async (file: File) => {
        try {
            if (checkImageSize) {
                const size = await checkWidthAndHeight(file);
                if (size.width < 1280 || size.height < 720) {
                    onError?.();
                    return;
                }
            }

            const validExtensions = [".png", ".jpeg", ".jpg"];
            const fileExtension = file.name
                .toLowerCase()
                .slice(file.name.lastIndexOf("."));
            if (!validExtensions.includes(fileExtension)) {
                onError?.();
                return;
            }

            const url = URL.createObjectURL(file);
            onSuccess?.();
            setImg({ ...img, file, src: url });
        } catch (e) {
            onError?.();
        }
    };

    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        onSuccess?.();
        const fileList = event.target.files;
        if (fileList && fileList.length > 0) {
            await handleUpload(fileList[0]);
        }
        event.target.value = "";
    };

    const handleDelete = () => {
        setImg({ ...img, file: null, src: null });
    };

    return (
        <div className={cn(styles.main)}>
            {img.src && (
                <div className={cn(styles.imageWrapper)}>
                    <div className={cn({ [styles.imageLoading]: isLoading })}>
                        <img
                            src={img.src}
                            alt="uploaded"
                            className={cn(styles.imageCover)}
                        />
                    </div>
                    {!isLoading && (
                        <div className={styles.containerButtons}>
                            <InputFile
                                id="upload image"
                                onChange={handleFileChange}
                                wrapperClassName={styles.inputButton}
                                uploadedImageClassName={styles.hiddenImg}
                                labelClassName={styles.inputButton}
                                labelChildren={(
                                    <div className={styles.buttons}>
                                        {t("description.Изменить")}
                                    </div>
                                )}
                                disableDropzone
                            />
                            <Button
                                className={styles.buttons}
                                color="BLUE"
                                size="SMALL"
                                variant="OUTLINE"
                                onClick={handleDelete}
                            >
                                {t("description.Удалить")}
                            </Button>
                        </div>
                    )}
                    {isLoading
                    && (
                        <div className={styles.loader}>
                            <CircularProgress />
                        </div>
                    )}
                </div>
            )}
            {!img.src && (
                <InputFile
                    onChange={handleFileChange}
                    onDropFiles={(files) => handleUpload(files[0])}
                    imageURL={img.src}
                    uploadedImageClassName={styles.uploadedImg}
                    wrapperClassName={cn(styles.wrapper, wrapperClassName)}
                    labelClassName={cn(styles.label, labelClassName)}
                    labelChildren={labelChildren}
                    id={id}
                    {...restInputProps}
                />
            )}
            <div
                className={cn(
                    extraWrapperClassName,
                    styles.extraWrapper,
                )}
            >
                {description}
            </div>
        </div>
    );
};

export default React.memo(ImageInput);
