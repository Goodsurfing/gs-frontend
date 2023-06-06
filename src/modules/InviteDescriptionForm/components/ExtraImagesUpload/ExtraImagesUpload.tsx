import React, { FC, useState } from "react";

import ExtraImagesItem from "../ExtraImagesItem/ExtraImagesItem";
import ExtraImagesItemButton from "../ExtraImagesItem/ExtraImagesItemButton/ExtraImagesItemButton";
import PictureReview from "../PictureReview/PictureReview";

import styles from "./ExtraImagesUpload.module.scss";

const ExtraImagesUpload: FC = () => {
    const [imagesArray, setImagesArray] = useState<Array<string>>([]);
    const [inputImg, setInputImg] = useState<string | null>(null);

    const handleImageUpload = (img: string | null) => {
        if (img) {
            setInputImg(null);
            setImagesArray([...imagesArray, img]);
        }
    };

    const handleCloseBtnClick = (index: number) => {
        setImagesArray((prev) => { return [...prev.filter((item, i) => { return i !== index; })]; });
    };

    return (
        <div className={styles.wrapper}>
            <ExtraImagesItem
                img={inputImg}
                setImg={handleImageUpload}
                id="asd"
            />
            {imagesArray.map((image, index) => {
                return (
                    <PictureReview
                        className={styles.imgItem}
                        key={index}
                        img={image}
                        close={(
                            <ExtraImagesItemButton
                                className={styles.closeBtn}
                                onClick={() => { return handleCloseBtnClick(index); }}
                            />
                        )}
                    />
                );
            })}
        </div>
    );
};

export default ExtraImagesUpload;
