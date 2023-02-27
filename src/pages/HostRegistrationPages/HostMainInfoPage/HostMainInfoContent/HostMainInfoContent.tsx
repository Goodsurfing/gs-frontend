import React, { FC } from "react";

import YMapWithAddress from "@/components/Ymaps/YMapWithAddress/YMapWithAddress";
import Button from "@/components/ui/Button/Button";
import styles from "./HostMainInfoContent.module.scss";
import HostMainInfoInputs from "../HostMainInfoInputs/HostMainInfoInputs";
import { Variant } from "@/components/ui/Button/Button.interface";

const HostMainInfoContent: FC = () => {
    return (
        <div className={styles.wrapper}>
            <YMapWithAddress />
            <HostMainInfoInputs />
            <Button className={styles.button} variant={Variant.PRIMARY} rounded={true}>Сохранить</Button>
        </div>
    );
};

export default HostMainInfoContent;
