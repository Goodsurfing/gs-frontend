import React from "react";
import { UploadMultipleImages } from "@/modules/Gallery";

import { TitleGallery } from "../TitleGallery/TitleGallery";
import { TitleVideoGallery } from "../TitleVideoGallery/TitleVideoGallery";
import styles from "./VolunteerGalleryPage.module.scss";
import { VideoForm } from "@/features/VideoForm";
import { TitleCertificate } from "../TitleCertificate/TitleCertificate";

const VolunteerGalleryPage = () => (
    <div className={styles.wrapper}>
        <TitleGallery />
        <UploadMultipleImages id="upload-images" className={styles.container} />
        <TitleVideoGallery className={styles.container} />
        <VideoForm />
        <TitleCertificate className={styles.container} />
        <UploadMultipleImages id="upload-images" className={styles.container} />
    </div>
);

export default VolunteerGalleryPage;
