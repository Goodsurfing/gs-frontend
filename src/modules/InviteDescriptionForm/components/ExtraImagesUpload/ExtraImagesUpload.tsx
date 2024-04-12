import React, { FC, useState } from "react";

import cn from "classnames";
import ExtraImagesItem from "../ExtraImagesItem/ExtraImagesItem";
import ExtraImagesItemButton from "../ExtraImagesItem/ExtraImagesItemButton/ExtraImagesItemButton";
import PictureReview from "../PictureReview/PictureReview";
import styles from "./ExtraImagesUpload.module.scss";
import { ImageType } from "@/components/ImageInput/types";
import { DescriptionImage } from "../../model/types/inviteDescription";

interface ExtraImagesUploadProps {
    label: string;
    value: DescriptionImage[];
    onChange: (value: DescriptionImage[]) => void;
    isLoading?: boolean;
    classNameWrapper?: string;
}

const ExtraImagesUpload: FC<ExtraImagesUploadProps> = (props) => {
    const {
        value, onChange, classNameWrapper, label, isLoading,
    } = props;
    const [inputImg, setInputImg] = useState<ImageType>({ file: null, src: null });

    const handleImageUpload = (img: ImageType) => {
        setInputImg((prev) => ({ ...prev, file: null, src: null }));
        onChange([...value, { uuid: null, image: img }]);
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
                    isLoading={isLoading}
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
