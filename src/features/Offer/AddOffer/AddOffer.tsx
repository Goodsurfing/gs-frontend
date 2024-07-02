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
    const [postOffer, { isLoading, isError }] = useCreateOfferMutation();
    const [disabledButton, setDisabledButton] = useState<boolean>(true);
    const { profile } = useUser();
    const navigate = useNavigate();
    const { locale } = useLocale();

    const addOfferHandle = async () => {
        if (!profile?.organizations?.length) {
            return;
        }
        const result = await postOffer({ status: "empty" }).unwrap();
        navigate(`/${locale}/offers/welcome/${result}`);
    };

    useEffect(() => {
        if (profile?.organizations?.length) {
            setDisabledButton(false);
        }
    }, [profile?.organizations?.length]);

    return (
        <div className={styles.btnWrapper}>
            {isError && (
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
