import React, { FC } from "react";

import { RoleCard } from "@/features/ProfileRole";

import { roleData } from "./model/data/roleData";
import { RoleInfo } from "./model/types/profileRoleWidget";
import styles from "./ProfileRoleWidget.module.scss";

export const ProfileRoleWidget: FC = () => {
    const renderRole = (rolesProfile: RoleInfo[]) => rolesProfile.map((role, index) => (
        <RoleCard
            titleRole={role.titleRole}
            descriptionRole={role.descriptionRole}
            imageRole={role.imageRole}
            buttonText={role.buttonText}
            key={index}
        />
    ));

    return <div className={styles.wrapper}>{renderRole(roleData)}</div>;
};
