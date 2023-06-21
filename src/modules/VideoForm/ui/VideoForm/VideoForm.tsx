import React from "react";

import styles from "./VideoForm.module.scss";
import Button from "@/UI/Button/Button";
import { Variant } from "@/UI/Button/Button.interface";
import { Text } from "../Text/Text";
import { VideoInput } from "../VideoInput/VideoInput";

export const VideoForm = () => {
    return (
        <div className={styles.wrapper}>
            <Text />
            <VideoInput />
            <Button className={styles.btn} variant={Variant.PRIMARY}>
                Сохранить
            </Button>
        </div>
    );
};
