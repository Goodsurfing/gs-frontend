import React, { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";
import ImageInput from "@/components/ImageInput/ImageInput";

import styles from "./ImageUpload.module.scss";
import ImageUploadBackground from "./ImageUploadBackground/ImageUploadBackground";

const ImageUpload: FC = () => {
    const { control } = useFormContext();

    return (
        <Controller
            control={control}
            name="coverImage"
            render={({ field }) => (
                <ImageInput
                    img={field.value}
                    setImg={field.onChange}
                    wrapperClassName={styles.input}
                    labelClassName={styles.label}
                    labelChildren={<ImageUploadBackground />}
                    description={(
                        <span className={styles.description}>
                            Ширина фотографии для обложки не меньше 1920
                            пикселей
                        </span>
                    )}
                    id="image-wrapper"
                />
            )}
        />
    );
};

export default ImageUpload;
