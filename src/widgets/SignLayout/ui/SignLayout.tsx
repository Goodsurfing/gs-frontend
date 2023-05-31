import cancelIcon from "assets/icons/mobile-cancel.svg";
import { FC, PropsWithChildren } from "react";
import { Link } from "react-router-dom";

import { AppRoutes } from "app/router";

import { ButtonLink } from "shared/ui/ButtonLink";
import { EmptyHeader } from "shared/ui/EmptyHeader";

import styles from "./SignLayout.module.scss";

interface SignLayoutProps {
    cancelPath: AppRoutes | string;
    cancelText: string;
}

export const SignLayout: FC<PropsWithChildren<SignLayoutProps>> = ({
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
