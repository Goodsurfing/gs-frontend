import { FC, PropsWithChildren, useEffect } from "react";
import {
    Link, useNavigate,
} from "react-router-dom";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";

import EmptyHeader from "@/shared/ui/EmptyHeader/EmptyHeader";

import cancelIcon from "@/shared/assets/icons/mobile-cancel.svg";

import { getMainPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import Preloader from "../Preloader/Preloader";
import { useAuth } from "@/routes/model/guards/AuthProvider";
import styles from "./SignLayout.module.scss";

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
    const { isAuth } = useAuth();

    useEffect(() => {
        if (isAuth) {
            navigate(getMainPageUrl(locale));
        }
    }, [isAuth, locale, navigate]);

    if (isAuth) {
        return (
            <Preloader />
        );
    }

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
