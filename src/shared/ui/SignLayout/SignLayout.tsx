import { FC, PropsWithChildren, useEffect } from "react";
import {
    Link, useNavigate,
} from "react-router-dom";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";

import EmptyHeader from "@/shared/ui/EmptyHeader/EmptyHeader";

import cancelIcon from "@/shared/assets/icons/mobile-cancel.svg";

import styles from "./SignLayout.module.scss";
import { useAppSelector } from "@/shared/hooks/redux";
import { getUserAuthData } from "@/entities/User";
import { getMainPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";

interface SignLayoutProps {
    cancelPath: string;
    cancelText: string;
}

const SignLayout: FC<PropsWithChildren<SignLayoutProps>> = ({
    cancelText,
    cancelPath,
    children,
}) => {
    const { locale } = useLocale();
    const navigate = useNavigate();
    const isAuth = useAppSelector(getUserAuthData);

    useEffect(() => {
        if (isAuth) {
            navigate(getMainPageUrl(locale));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
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
};

export default SignLayout;
