import cn from "classnames";
import React, { FC, useState } from "react";

import InputFile from "@/shared/ui/InputFile/InputFile";
import { checkWidthAndHeight } from "@/shared/utils/files/checkWidthAndHeight";

import styles from "./ImageInput.module.scss";
import { ImageInputComponentProps } from "./types";
import Button from "@/shared/ui/Button/Button";

const ImageInput: FC<ImageInputComponentProps> = ({
    img,
    setImg,
    id,
    description,
    extraWrapperClassName,
    labelChildren,
    wrapperClassName,
    setUrlImage,
    labelClassName,
    ...restInputProps
}) => {
    const [error, setError] = useState<boolean>(false);

    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const fileList = event.target.files;
        if (fileList && fileList.length > 0) {
            const file = fileList[0];
            try {
                const size = await checkWidthAndHeight(file);
                if (size.width < 1920 || size.height < 1080) {
                    setError(true);
                    return;
                }
                const formData = new FormData();
                formData.append("image", file);
                console.log(typeof formData.get("image"));
                const url = URL.createObjectURL(file);
                console.log(url);
                setError(false);
                setImg(url);
            } catch (e) {
                setError(true);
            }
        }
    };

    const handleDelete = () => {
        setImg(null);
    };

    return (
        <div className={styles.main}>
            {img && (
                <div className={styles.imageWrapper}>
                    <img src={img} alt="uploaded" className={styles.imageCover} />
                    <div className={styles.containerButtons}>
                        <InputFile
                            id="upload image"
                            onChange={handleFileChange}
                            wrapperClassName={styles.inputButton}
                            uploadedImageClassName={styles.hiddenImg}
                            labelClassName={styles.inputButton}
                            labelChildren={(
                                <div
                                    className={styles.buttons}
                                >
                                    Изменить
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
                            Удалить
                        </Button>
                    </div>
                </div>
            )}
            {!img && (
                <>
                    <InputFile
                        onChange={handleFileChange}
                        imageURL={img}
                        uploadedImageClassName={styles.uploadedImg}
                        wrapperClassName={cn(styles.wrapper, wrapperClassName)}
                        labelClassName={cn(styles.label, labelClassName)}
                        labelChildren={labelChildren}
                        id={id}
                        {...restInputProps}
                    />
                    <div className={cn(extraWrapperClassName, styles.extraWrapper)}>
                        {error && (
                            <span className={styles.error}>Неверный формат файла</span>
                        )}
                        {description}
                    </div>
                </>
            )}
        </div>
    );
};

export default React.memo(ImageInput);
