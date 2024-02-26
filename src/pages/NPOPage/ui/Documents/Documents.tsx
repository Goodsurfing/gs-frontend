import React, { useMemo, useState } from "react";

import { useTranslation } from "react-i18next";
import registrationImage from "@/shared/assets/images/npo/768c32464538f17202027cdcf5925a45.png";
import certificateImage from "@/shared/assets/images/npo/a56ccf958a9811de0657b7adb856c10e.png";
import { Modal } from "@/shared/ui/Modal/Modal";

import styles from "./Documents.module.scss";

const documents = [registrationImage, certificateImage];

export const Documents = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const { t } = useTranslation("npo");

    const renderImages = useMemo(
        () => documents.map((image, index) => (
            <img
                src={image}
                alt="document"
                className={styles.image}
                onClick={() => setSelectedImage(image)}
                key={index}
            />
        )),
        [],
    );

    return (
        <div className={styles.wrapper}>
            <h2 className={styles.title}>{t("Уставные документы")}</h2>
            <div className={styles.content}>{renderImages}</div>
            {selectedImage !== null && (
                <Modal onClose={() => setSelectedImage(null)}>
                    <img
                        className={styles.modalImgae}
                        src={selectedImage}
                        alt=""
                    />
                </Modal>
            )}
        </div>
    );
};
