import cn from "classnames";
import React, { FC, useEffect, useState } from "react";
import { validImageFileTypes } from "@/constants/files";

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
    return (
        <div className={styles.wrapper}>
            <label
                htmlFor={id}
                className={cn(styles.label, {
                    [styles.disabled]: disabled,
                })}
            >
                <input
                    type="file"
                    name={name}
                    id={id}
                    value={value}
                    disabled={disabled}
                    onChange={onChange}
                    {...rest}
                />
            </label>
        </div>
    );
};

export default ImageUpload;
