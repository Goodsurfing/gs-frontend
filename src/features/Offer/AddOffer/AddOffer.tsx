import React from "react";
import { useNavigate } from "react-router-dom";
import { useCreateOfferMutation } from "@/entities/Offer";
import Button from "@/shared/ui/Button/Button";
import { useLocale } from "@/app/providers/LocaleProvider";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType } from "@/shared/ui/HintPopup/HintPopup.interface";
import styles from "./AddOffer.module.scss";

export const AddOffer = () => {
    const [postOffer, { isLoading, isError }] = useCreateOfferMutation();
    const navigate = useNavigate();
    const { locale } = useLocale();

    const addOfferHandle = async () => {
        const result = await postOffer().unwrap();

        navigate(`${locale}/offers/welcome/${result.id}`);
    };

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
                disabled={isLoading}
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
