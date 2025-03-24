import React, { FC } from "react";

import { useTranslation } from "react-i18next";
import { Title as HostGalleryTitle } from "./Title/Title";

import styles from "./HostGalleryPage.module.scss";
import { HostGalleryForm } from "@/features/HostGalleryForm";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";

const HostGalleryPage: FC = () => {
    const { ready } = useTranslation("host");

    if (!ready) {
        return (<MiniLoader />);
    }

    return (
        <>
            <HostGalleryTitle />
            <HostGalleryForm className={styles.imageUpload} />
        </>
    );
};

export default HostGalleryPage;
