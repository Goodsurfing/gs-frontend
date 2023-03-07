import React, { FC } from "react";

import YMapWithAddress from "@/components/Ymaps/YMapWithAddress/YMapWithAddress";
import Button from "@/components/ui/Button/Button";
import { Variant } from "@/components/ui/Button/Button.interface";

import styles from "./HostMainInfoForm.module.scss";
import HostMainInfoOrganization from "./HostMainInfoOrganization/HostMainInfoOrganization";
import HostMainInfoSocial from "./HostMainInfoSocial/HostMainInfoSocial";

const HostMainInfoContent: FC = () => {
    return (
        <div className={styles.wrapper}>
            <form className={styles.container}>
                <YMapWithAddress />
                <HostMainInfoOrganization />
                <HostMainInfoSocial />
                <Button
                    className={styles.button}
                    variant={Variant.PRIMARY}
                    rounded={true}
                >
                    Сохранить
                </Button>
            </form>
        </div>
    );
};

export default React.memo(HostMainInfoContent);
