import React, { FC, useState } from "react";

import cn from "classnames";
import ExtraImagesItem from "../ExtraImagesItem/ExtraImagesItem";
import ExtraImagesItemButton from "../ExtraImagesItem/ExtraImagesItemButton/ExtraImagesItemButton";
import PictureReview from "../PictureReview/PictureReview";
import styles from "./ExtraImagesUpload.module.scss";

interface ExtraImagesUploadProps {
    label: string;
    value: File[];
    onChange: (value: File[]) => void;
    classNameWrapper?: string;
}

const ExtraImagesUpload: FC<ExtraImagesUploadProps> = (props) => {
    const {
        value, onChange, classNameWrapper, label,
    } = props;
    const [inputImg, setInputImg] = useState<string | null>(null);
    const [images, setImages] = useState<Array<string>>([]);

    const handleImageUpload = (img: string | null) => {
        if (img) {
            setInputImg(null);
            setImages([...images, img]);
        }
    };

    const handleFileUploadImage = (file: File) => {
        onChange([...value, file]);
    };

    const handleCloseBtnClick = (index: number) => {
        setImages(images.filter((item, i) => i !== index));
    };

    return (
        <div className={cn(classNameWrapper, styles.wrapper)}>
            <ExtraImagesItem
                label={label}
                img={inputImg}
                setImg={handleImageUpload}
                onUpload={handleFileUploadImage}
                id="asd"
            />
            {images.map((image, index) => (
                <PictureReview
                    className={styles.imgItem}
                    key={index}
                    img={image}
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
