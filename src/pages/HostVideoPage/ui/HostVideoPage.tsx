import { FC } from "react";

import { VideoForm } from "@/modules/VideoForm";

import styles from "./HostVideoPage.module.scss";

const HostVideoPage: FC = () => (
    <div className={styles.wrapper}>
        <VideoForm />
    </div>
);

export default HostVideoPage;
