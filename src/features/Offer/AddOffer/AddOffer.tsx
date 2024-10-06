import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateOfferMutation } from "@/entities/Offer";
import Button from "@/shared/ui/Button/Button";
import { useLocale } from "@/app/providers/LocaleProvider";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType } from "@/shared/ui/HintPopup/HintPopup.interface";
import styles from "./AddOffer.module.scss";
import { useUser } from "@/entities/Profile";

export const AddOffer = () => {
    const [createOffer, { isLoading, isError }] = useCreateOfferMutation();
    const [createOfferError, setCreateOfferError] = useState<boolean>(false);
    const [disabledButton, setDisabledButton] = useState<boolean>(true);
    const { profile } = useUser();
    const navigate = useNavigate();
    const { locale } = useLocale();

    const addOfferHandle = async () => {
        setCreateOfferError(false);
        if (!profile?.host) {
            return;
        }
        const formData = new FormData();
        createOffer(formData).unwrap()
            .then((result) => {
                navigate(`/${locale}/offers/welcome/${result.id}`);
            })
            .catch(() => {
                setCreateOfferError(true);
            });
    };

    useEffect(() => {
        if (profile?.host) {
            setDisabledButton(false);
        }
    }, [profile?.host]);

    return (
        <div className={styles.btnWrapper}>
            {(isError || createOfferError) && (
                <HintPopup
                    text="Ошибка создания вакансии"
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
                {isLoading ? "Создание..." : "Добавить предложение"}
            </Button>
        </div>
    );
};
