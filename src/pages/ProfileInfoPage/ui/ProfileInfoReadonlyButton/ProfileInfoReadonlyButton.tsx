import { memo, useCallback } from "react";

import { useTranslation } from "react-i18next";
import styles from "./ProfileInfoReadonlyButton.module.scss";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/redux";
import { getProfileReadonly, profileActions } from "@/entities/Profile";

export const ProfileInfoReadonlyButton = memo(() => {
    const readOnly = useAppSelector(getProfileReadonly);
    const dispatch = useAppDispatch();

    const { t } = useTranslation();

    const onReadonlyChange = useCallback(() => {
        dispatch(profileActions.setReadonly(!readOnly));
    }, [dispatch, readOnly]);

    return (
        <button
            className={styles.link}
            onClick={onReadonlyChange}
            type="button"
        >
            {readOnly ? t("Редактировать профиль") : t("Отменить изменения")}
        </button>
    );
});
