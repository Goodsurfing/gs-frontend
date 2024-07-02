import React, { FC, useState } from "react";

import cn from "classnames";
import ExtraImagesItem from "../ExtraImagesItem/ExtraImagesItem";
import ExtraImagesItemButton from "../ExtraImagesItem/ExtraImagesItemButton/ExtraImagesItemButton";
import PictureReview from "../PictureReview/PictureReview";
import { ImageType } from "@/components/ImageInput/types";
import { DescriptionImage } from "../../model/types/inviteDescription";
import uploadFile from "@/shared/hooks/files/useUploadFile";
import { BASE_URL } from "@/shared/constants/api";
import styles from "./ExtraImagesUpload.module.scss";

interface ExtraImagesUploadProps {
    label: string;
    value: DescriptionImage[];
    isLoading: boolean;
    onChange: (value: DescriptionImage[]) => void;
    onChangeLoading: (value: boolean) => void;
    classNameWrapper?: string;
}

const ExtraImagesUpload: FC<ExtraImagesUploadProps> = (props) => {
    const {
        value, onChange, classNameWrapper, label, isLoading, onChangeLoading,
    } = props;
    const [inputImg, setInputImg] = useState<ImageType>({ file: null, src: null });

    const handleImageUpload = (img: ImageType) => {
        const { file, src } = img;
        onChangeLoading(true);
        const newValue = [...value, { uuid: null, image: { file, src } }];
        onChange(newValue);
        if (file) {
            uploadFile(file.name, file)
                .then((result) => {
                    const updatedValue = newValue.map((item) => (item.image.file === file
                        ? { uuid: `${BASE_URL}${result?.["@id"].slice(1)}` || null, image: { file: null, src: `${BASE_URL}${result?.contentUrl.slice(1)}` || null } }
                        : item));
                    onChange(updatedValue);
                })
                .catch(() => {
                    onChange(value);
                })
                .finally(() => {
                    onChangeLoading(false);
                    setInputImg((prev) => ({ ...prev, file: null, src: null }));
                });
        }
    };

    const handleCloseBtnClick = (index: number) => {
        onChange(value.filter((item, i) => i !== index));
    };

    return (
        <div className={cn(classNameWrapper, styles.wrapper)}>
            <ExtraImagesItem
                label={label}
                img={inputImg}
                setImg={handleImageUpload}
                id="asd"
            />
            {value.map((image, index) => (
                <PictureReview
                    className={styles.imgItem}
                    key={index}
                    img={image.image.src || ""}
                    isLoading={isLoading} // change logic for personal image loading
                    close={(
                        <ExtraImagesItemButton
                            className={styles.closeBtn}
                            onClick={() => handleCloseBtnClick(index)}
                        />
                    )}
                />
            ))}
        </div>
    );
};

export default ExtraImagesUpload;
