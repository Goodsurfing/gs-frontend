import React, {
    FC, PropsWithChildren, memo, useEffect,
} from "react";
import { createPortal } from "react-dom";

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
            return () => {
                document.body.removeChild(modal);
            };
        }, [modal]);

        return createPortal(
            <div className={styles.wrapper} onClick={onClose}>
                <div onClick={(event) => event.stopPropagation()}>
                    <button
                        type="button"
                        className={styles.buttonClose}
                        onClick={onClose}
                    >
                        X
                    </button>
                    {children}
                </div>
            </div>,
            modal,
        );
    },
);
