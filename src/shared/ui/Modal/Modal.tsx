import React, {
    FC, PropsWithChildren, memo, useEffect,
} from "react";
import { createPortal } from "react-dom";

import closeIcon from "@/shared/assets/icons/delete.svg";

import IconComponent from "../IconComponent/IconComponent";
import styles from "./Modal.module.scss";

interface ModalProps {
    onClose: () => void;
}

export const Modal: FC<PropsWithChildren<ModalProps>> = memo(
    (props: PropsWithChildren<ModalProps>) => {
        const { onClose, children } = props;
        const modal = document.createElement("modal");

        useEffect(() => {
            document.body.appendChild(modal);
            document.body.style.overflow = "hidden";
            return () => {
                document.body.removeChild(modal);
                document.body.style.overflow = "";
            };
        }, [modal]);

        return createPortal(
            <div className={styles.wrapper} onClick={onClose}>
                <div
                    className={styles.container}
                    onClick={(event) => event.stopPropagation()}
                >
                    <IconComponent
                        icon={closeIcon}
                        alt="close"
                        className={styles.buttonClose}
                        onClick={onClose}
                    />
                    {children}
                </div>
            </div>,
            modal,
        );
    },
);
