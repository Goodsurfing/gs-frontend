import React, { FC, PropsWithChildren } from "react";
import { Link } from "react-router-dom";

import ButtonLink from "@/components/ui/ButtonLink/ButtonLink";
import EmptyHeader from "@/components/ui/EmptyHeader/EmptyHeader";

import { AppRoutesEnum } from "@/routes/types";

import cancelIcon from "@/assets/icons/mobile-cancel.svg";

import styles from "./SignLayout.module.scss";

interface SignLayoutProps {
    cancelPath: AppRoutesEnum;
    cancelText: string;
}

const SignLayout: FC<PropsWithChildren<SignLayoutProps>> = ({
    cancelText,
    cancelPath,
    children,
}) => {
    return (
        <>
            <EmptyHeader />
            <div className={styles.cancel}>
                <ButtonLink
                    type={"outlined"}
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
};

export default SignLayout;
