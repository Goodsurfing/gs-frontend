import React from "react";

import { TitleGallery } from "../TitleGallery/TitleGallery";
import { TitleVideoGallery } from "../TitleVideoGallery/TitleVideoGallery";
import { VideoForm } from "@/features/VideoForm";
import { TitleCertificate } from "../TitleCertificate/TitleCertificate";
import styles from "./VolunteerGalleryPage.module.scss";
import { UploadCertificates } from "@/features/UploadCertificates";
import { useGetProfileInfoQuery } from "@/entities/Profile";
import { VolunteerGalleryForm } from "@/features/VolunteerGalleryForm";
import Preloader from "@/shared/ui/Preloader/Preloader";

const VolunteerGalleryPage = () => {
    const { data: profileData, isLoading } = useGetProfileInfoQuery();

    if (isLoading) {
        return (
            <div className={styles.wrapper}>
                <Preloader />
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            {profileData && (
                <>
                    <TitleGallery />
                    <VolunteerGalleryForm className={styles.container} profileData={profileData} />
                    <TitleVideoGallery className={styles.container} />
                    <VideoForm
                        profileId={profileData.id}
                        videoGallery={profileData.videoGallery}
                    />
                    <TitleCertificate className={styles.container} />
                    <UploadCertificates
                        profileId={profileData.id}
                        id="upload-certificate"
                        className={styles.container}
                    />
                </>
            )}
        </div>
    );
};

export default VolunteerGalleryPage;
