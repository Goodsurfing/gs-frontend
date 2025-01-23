import { FC } from "react";

import { HostVideoForm } from "@/features/VideoForm";

import { Text } from "./Text/Text";
import styles from "./HostVideoPage.module.scss";
import { useGetMyHostQuery } from "@/entities/Host";

const HostVideoPage: FC = () => {
    const { data: myHost } = useGetMyHostQuery();

    return (
        <div className={styles.wrapper}>
            <Text />
            {(myHost) && (
                <HostVideoForm
                    host={myHost}
                    videoGallery={myHost.videoGallery}
                />
            )}
        </div>
    );
};
export default HostVideoPage;
