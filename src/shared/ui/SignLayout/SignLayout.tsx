import React, { FC, PropsWithChildren } from "react";
import { Link } from "react-router-dom";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";

import EmptyHeader from "@/shared/ui/EmptyHeader/EmptyHeader";

import cancelIcon from "@/shared/assets/icons/mobile-cancel.svg";

import styles from "./SignLayout.module.scss";

interface SignLayoutProps {
    cancelPath: string;
    cancelText: string;
}

const SignLayout: FC<PropsWithChildren<SignLayoutProps>> = ({
    cancelText,
    cancelPath,
    children,
}) => (
    <>
        <EmptyHeader />
        <div className={styles.cancel}>
            <ButtonLink
                type="outlined"
                className={styles.btn}
                path={cancelPath}
            >
                {cancelText}
            </ButtonLink>
            <Link className={styles.mobileBtn} to={cancelPath}>
                <img src={cancelIcon} alt={cancelText} />
            </Link>
        </div>
        <div className={styles.container}>{children}</div>
    </>
);

export default SignLayout;
