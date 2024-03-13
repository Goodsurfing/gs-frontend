import React, { FC, useState } from "react";

import cn from "classnames";
import ExtraImagesItem from "../ExtraImagesItem/ExtraImagesItem";
import ExtraImagesItemButton from "../ExtraImagesItem/ExtraImagesItemButton/ExtraImagesItemButton";
import PictureReview from "../PictureReview/PictureReview";
import styles from "./ExtraImagesUpload.module.scss";

interface ExtraImagesUploadProps {
    label: string;
    value: string[];
    onChange: (value: string[]) => void;
    classNameWrapper?: string;
}

const ExtraImagesUpload: FC<ExtraImagesUploadProps> = (props) => {
    const {
        value, onChange, classNameWrapper, label,
    } = props;
    const [inputImg, setInputImg] = useState<string | null>(null);

    const handleImageUpload = (img: string | null) => {
        if (img) {
            setInputImg(null);
            onChange([...value, img]);
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
