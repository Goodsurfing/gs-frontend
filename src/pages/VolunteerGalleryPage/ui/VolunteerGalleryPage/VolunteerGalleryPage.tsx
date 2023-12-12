import React from "react";
import { UploadMultipleImages } from "@/modules/Gallery";

import { TitleGallery } from "../TitleGallery/TitleGallery";
import { TitleVideoGallery } from "../TitleVideoGallery/TitleVideoGallery";
import styles from "./VolunteerGalleryPage.module.scss";
import { VideoForm } from "@/features/VideoForm";

const VolunteerGalleryPage = () => (
    <div className={styles.wrapper}>
        <TitleGallery />
        <UploadMultipleImages id="upload-images" className={styles.container} />
        <TitleVideoGallery className={styles.container} />
        <VideoForm />
    </div>
);

export default VolunteerGalleryPage;
