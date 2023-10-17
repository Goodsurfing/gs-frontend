import { FC } from "react";

import { VideoForm } from "@/features/VideoForm";

import styles from "./HostVideoPage.module.scss";

const HostVideoPage: FC = () => (
    <div className={styles.wrapper}>
        <VideoForm />
    </div>
);

export default HostVideoPage;
