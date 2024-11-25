import React from "react";

import { TitleGallery } from "../TitleGallery/TitleGallery";
import { TitleVideoGallery } from "../TitleVideoGallery/TitleVideoGallery";
import { VideoForm } from "@/features/VideoForm";
import { TitleCertificate } from "../TitleCertificate/TitleCertificate";
import styles from "./VolunteerGalleryPage.module.scss";
import { UploadCertificates } from "@/features/UploadCertificates";
import { useGetProfileInfoQuery } from "@/entities/Profile";
import { VolunteerGalleryForm } from "@/features/VolunteerGalleryForm";

const VolunteerGalleryPage = () => {
    const { data: profileData } = useGetProfileInfoQuery();

    return (
        <div className={styles.wrapper}>
            <TitleGallery />
            <VolunteerGalleryForm className={styles.container} />
            <TitleVideoGallery className={styles.container} />
            {(profileData) && (
                <VideoForm
                    profileId={profileData.id}
                    videoGallery={profileData.videoGallery}
                />
            )}
            <TitleCertificate className={styles.container} />
            <UploadCertificates id="upload-certificate" className={styles.container} />
        </div>
    );
};

export default VolunteerGalleryPage;
