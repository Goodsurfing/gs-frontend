import React, {
    FC, PropsWithChildren, memo, useEffect,
    useRef,
} from "react";
import { createPortal } from "react-dom";

import cn from "classnames";
import closeIcon from "@/shared/assets/icons/delete.svg";

import IconComponent from "../IconComponent/IconComponent";
import styles from "./Modal.module.scss";

interface ModalProps {
    onClose: () => void;
    isShowCloseIcon?: boolean;
}

export const Modal: FC<PropsWithChildren<ModalProps>> = memo(
    (props: PropsWithChildren<ModalProps>) => {
        const { onClose, children, isShowCloseIcon = true } = props;

        const modalRef = useRef<HTMLDivElement | null>(null);

        if (!modalRef.current) {
            modalRef.current = document.createElement("div");
            modalRef.current.className = "modal";
        }

        useEffect(() => {
            const modal = modalRef.current!;
            document.body.appendChild(modal);
            document.body.style.overflow = "hidden";
            return () => {
                document.body.removeChild(modal);
                document.body.style.overflow = "";
            };
        }, []);

        return createPortal(
            <div className={styles.wrapper} onClick={onClose}>
                <div
                    className={styles.container}
                    onClick={(event) => event.stopPropagation()}
                >
                    <IconComponent
                        icon={closeIcon}
                        alt="close"
                        className={cn(styles.buttonClose, { [styles.hidden]: !isShowCloseIcon })}
                        onClick={onClose}
                    />
                    {children}
                </div>
            </div>,
            modalRef.current,
        );
    },
);
