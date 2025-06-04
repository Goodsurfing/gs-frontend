import { FC } from "react";
import { useTranslation } from "react-i18next";

import { HostVideoForm } from "@/features/VideoForm";

import { useGetMyHostQuery } from "@/entities/Host";

import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";

import styles from "./HostVideoPage.module.scss";
import { Text } from "./Text/Text";

const HostVideoPage: FC = () => {
    const { data: myHost } = useGetMyHostQuery();
    const { ready } = useTranslation("host");

    if (!ready) {
        return (
            <div className={styles.wrapper}>
                <MiniLoader />
            </div>
        );
    }

    return (
        <div className={styles.wrapper}>
            <Text />
            {myHost && (
                <HostVideoForm
                    host={myHost}
                    videoGallery={myHost.videoGallery}
                />
            )}
        </div>
    );
};
export default HostVideoPage;
