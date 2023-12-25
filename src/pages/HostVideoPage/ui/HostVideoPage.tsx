import { FC } from "react";

import { VideoForm } from "@/features/VideoForm";

import Button from "@/shared/ui/Button/Button";

import styles from "./HostVideoPage.module.scss";
import { Text } from "./Text/Text";

const HostVideoPage: FC = () => (
    <div className={styles.wrapper}>
        <Text />
        <VideoForm />
        <Button
            className={styles.btn}
            variant="FILL"
            color="BLUE"
            size="MEDIUM"
        >
            Сохранить
        </Button>
    </div>
);

export default HostVideoPage;
