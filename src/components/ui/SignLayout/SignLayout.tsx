import React, { FC, PropsWithChildren } from "react";

import ButtonLink from "@/components/ui/ButtonLink/ButtonLink";
import EmptyHeader from "@/components/ui/EmptyHeader/EmptyHeader";

import { AppRoutesEnum } from "@/routes/types";

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
            </div>
            <div className={styles.container}>{children}</div>
        </>
    );
};

export default SignLayout;
