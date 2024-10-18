import { FC } from "react";

import { VideoForm } from "@/features/VideoForm";

import { Text } from "./Text/Text";
import { useGetProfileInfoQuery } from "@/entities/Profile";
import styles from "./HostVideoPage.module.scss";

const HostVideoPage: FC = () => {
    const { data: profileData } = useGetProfileInfoQuery();

    return (
        <div className={styles.wrapper}>
            <Text />
            {(profileData) && (
                <VideoForm
                    profileId={profileData.id}
                    videoGallery={profileData.videoGallery}
                />
            )}
        </div>
    );
};
export default HostVideoPage;
