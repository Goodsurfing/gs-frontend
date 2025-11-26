import React, { FC, memo } from "react";
import { useTranslation } from "react-i18next";

import { Host } from "@/entities/Host";

import { getMediaContent } from "@/shared/lib/getMediaContent";
import { Avatar } from "@/shared/ui/Avatar/Avatar";
import Button from "@/shared/ui/Button/Button";

import styles from "./HostlHeaderCard.module.scss";
import { useGetTypeOrganization } from "@/shared/hooks/useGetTypeOrganization";

interface HostlHeaderCardProps {
    host: Host;
    isEdit: boolean;
    isAuth: boolean;
    handleEditClick: () => void;
    handleWriteClick: () => void;
    isShowWriteButton: boolean;
}

export const HostlHeaderCard: FC<HostlHeaderCardProps> = memo(
    (props: HostlHeaderCardProps) => {
        const {
            host: {
                name, type, address, avatar,
            },
            isEdit,
            isAuth,
            handleEditClick,
            handleWriteClick,
            isShowWriteButton,
        } = props;
        const { t } = useTranslation("host");
        const { getTranslate } = useGetTypeOrganization();

        const renderButtons = (
            <>
                {(isEdit && isAuth) && (
                    <Button
                        size="SMALL"
                        color="BLUE"
                        variant="OUTLINE"
                        className={styles.button}
                        onClick={handleEditClick}
                    >
                        {t("personalHost.Редактировать профиль")}
                    </Button>
                )}

                {(isShowWriteButton && (!isEdit && isAuth)) && (
                    <Button
                        size="SMALL"
                        color="BLUE"
                        variant="FILL"
                        className={styles.button}
                        onClick={handleWriteClick}
                    >
                        {t("personalHost.Написать")}
                    </Button>
                )}
            </>
        );

        return (
            <div className={styles.wrapper}>
                <Avatar
                    icon={getMediaContent(avatar)}
                    size="DEFAULT"
                    className={styles.image}
                    alt="avatar"
                />
                <div className={styles.containerInfo}>
                    <span className={styles.type}>
                        {t("personalHost.Организация/")}
                        {getTranslate(type)}
                    </span>
                    <h3 className={styles.name}>{name}</h3>
                    <span className={styles.address}>{address}</span>
                </div>
                <div className={styles.btnMedalsContainer}>
                    {renderButtons}
                </div>
            </div>
        );
    },
);
