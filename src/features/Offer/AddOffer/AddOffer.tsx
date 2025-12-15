import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCreateOfferMutation } from "@/entities/Offer";
import Button from "@/shared/ui/Button/Button";
import { useLocale } from "@/app/providers/LocaleProvider";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType } from "@/shared/ui/HintPopup/HintPopup.interface";
import styles from "./AddOffer.module.scss";
import { useUser } from "@/entities/Profile";

export const AddOffer = () => {
    const { t } = useTranslation("host");
    const [createOffer, { isLoading, isError }] = useCreateOfferMutation();
    const [createOfferError, setCreateOfferError] = useState<boolean>(false);
    const [disabledButton, setDisabledButton] = useState<boolean>(true);
    const { profile } = useUser();
    const navigate = useNavigate();
    const { locale } = useLocale();

    const addOfferHandle = async () => {
        setCreateOfferError(false);
        if (!profile?.hostId) {
            return;
        }
        const formData = new FormData();
        await createOffer(formData).unwrap()
            .then((result) => {
                navigate(`/${locale}/offers/welcome/${result.id}`);
            })
            .catch(() => {
                setCreateOfferError(true);
            });
    };

    useEffect(() => {
        if (profile?.hostId) {
            setDisabledButton(false);
        }
    }, [profile?.hostId]);

    return (
        <div className={styles.btnWrapper}>
            {(isError || createOfferError) && (
                <HintPopup
                    text={t("hostOffers.Ошибка создания вакансии")}
                    type={HintType.Error}
                />
            )}
            <Button
                variant="FILL"
                disabled={isLoading || disabledButton}
                color="BLUE"
                size="MEDIUM"
                className={styles.btn}
                onClick={addOfferHandle}
            >
                {t("hostOffers.Добавить предложение")}
            </Button>
        </div>
    );
};
