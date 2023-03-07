import React from "react";

import Dropdown from "@/components/ui/Dropdown/Dropdown";
import Input from "@/components/ui/Input/Input";
import Textarea from "@/components/ui/Textarea/Textarea";

import styles from "./HostMainInfoOrganization.module.scss";

const HostMainInfoOrganization = () => {
    return (
        <div className={styles.wrapper}>
            <Input
                id="organization-name"
                className={styles.organization}
                label="Название организации"
            />
            <Textarea
                className={styles.description}
                label="Опишите организацию в одно предложение"
            />
            <div className={styles.organizationTypeWrapper}>
                <Dropdown
                    label="Тип организации"
                    organizations={["ООО", "ОАО", "ООПТ"]}
                />
                <Input
                    id="organization-other"
                    className={styles.other}
                    label="Другое"
                />
            </div>
            <Input
                label="Сайт организации"
                className={styles.website}
                id="organization-website"
            />
            <Textarea
                id="organization-website"
                className={styles.website}
                description="Расскажите о вас, вашей команде и почему волонтёры должны выбрать вас для участия"
                label="Сайт организации"
            />
        </div>
    );
};

export default React.memo(HostMainInfoOrganization);
