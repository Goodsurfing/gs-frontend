import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/shared/ui/Button/Button";
import EmptyHeader from "@/shared/ui/EmptyHeader/EmptyHeader";
import { useAppDispatch } from "@/shared/hooks/redux";
import { getMainPageUrl } from "@/shared/config/routes/AppUrls";
import { userActions } from "@/entities/User";
import { useLocale } from "@/app/providers/LocaleProvider";
import styles from "./AdminHeader.module.scss";

export const AdminHeader = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { locale } = useLocale();

    const handleLogout = useCallback(() => {
        dispatch(userActions.logout());
        navigate(getMainPageUrl(locale));
    }, [dispatch, locale, navigate]);

    return (
        <EmptyHeader className={styles.header}>
            <div className={styles.button}>
                <Button onClick={handleLogout} color="BLUE" size="SMALL" variant="FILL">Выйти</Button>
            </div>
        </EmptyHeader>
    );
};
