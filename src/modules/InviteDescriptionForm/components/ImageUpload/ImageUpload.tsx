import React, { FC } from "react";
import { Controller, useFormContext } from "react-hook-form";
import ImageInput from "@/components/ImageInput/ImageInput";

import styles from "./ImageUpload.module.scss";
import ImageUploadBackground from "./ImageUploadBackground/ImageUploadBackground";

const ImageUpload: FC = () => {
    const { control, formState: { errors } } = useFormContext();

    const setUrlImage = (data: void) => {
        console.log("url image", data);
    };

    return (
        <Controller
            control={control}
            name="coverImage"
            rules={{ required: { value: true, message: "Загрузите обложку" } }}
            render={({ field }) => (
                <div>
                    <ImageInput
                        img={field.value}
                        setImg={field.onChange}
                        setUrlImage={setUrlImage}
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
                    <p className={styles.error}>{errors.coverImage?.message?.toString()}</p>
                </div>
            )}
        />
    );
};

export default ImageUpload;
