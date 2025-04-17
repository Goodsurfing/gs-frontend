import React from "react";

import { UploadCertificates } from "@/features/UploadCertificates";
import { VideoForm } from "@/features/VideoForm";
import { VolunteerGalleryForm } from "@/features/VolunteerGalleryForm";

import { useGetProfileInfoQuery } from "@/entities/Profile";

import Preloader from "@/shared/ui/Preloader/Preloader";

import { TitleCertificate } from "../TitleCertificate/TitleCertificate";
import { TitleGallery } from "../TitleGallery/TitleGallery";
import { TitleVideoGallery } from "../TitleVideoGallery/TitleVideoGallery";
import styles from "./VolunteerGalleryPage.module.scss";

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
                    <VolunteerGalleryForm
                        className={styles.container}
                        profileData={profileData}
                    />
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
