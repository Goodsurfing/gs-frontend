import { validImageFileTypes } from "@/constants/files";
import cn from "classnames";
import React, { FC, useEffect, useRef, useState } from "react";

import { useUploadFile } from "@/hooks/files/useUploadFile";

import { userInfoApi } from "@/store/api/userInfoApi";

import photoCameraIcon from "@/assets/icons/profile/photo-camera.svg";

import { ImageUploadProps } from "./ImageUpload.interface";
import styles from "./ImageUpload.module.scss";

const ImageUpload: FC<ImageUploadProps> = ({
    id,
    name,
    disabled,
    defaultImage,
    value,
    onChange,
    ...rest
}) => {
    const [selectedImage, setSelectedImage] = useState<File | null>();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files![0];
        if (file) {
            setSelectedImage(file);
        }

        if (event && onChange) {
            onChange(event);
        }
    };

    return (
        <div className={styles.wrapper}>
            <label
                htmlFor={id}
                className={cn(styles.label, {
                    [styles.disabled]: disabled,
                })}
            >
                {selectedImage && (
                    <img
                        src={URL.createObjectURL(selectedImage)}
                        alt="Some alt attribute"
                        className={styles.innerImage}
                    />
                )}
                <input
                    type="file"
                    name={name}
                    id={id}
                    value={value}
                    disabled={disabled}
                    onChange={handleChange}
                    {...rest}
                />
            </label>
        </div>
    );
};

export default ImageUpload;
