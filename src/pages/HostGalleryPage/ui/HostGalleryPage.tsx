import React, { FC } from "react";

import { Title as HostGalleryTitle } from "./Title/Title";

import styles from "./HostGalleryPage.module.scss";
import { HostGalleryForm } from "@/features/HostGalleryForm/HostGalleryForm";

const HostGalleryPage: FC = () => (
    <>
        <HostGalleryTitle />
        <HostGalleryForm className={styles.imageUpload} />
    </>
);

export default HostGalleryPage;
