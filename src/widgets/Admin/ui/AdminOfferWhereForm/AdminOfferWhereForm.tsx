import React, { FC, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AddressFormInput } from "@/widgets/AddressForm";
import { useLocale } from "@/app/providers/LocaleProvider";
import { ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { MapWithAddress } from "@/features/MapWithAddress";
import Button from "@/shared/ui/Button/Button";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import { getAdminVacancyWhenPageUrl } from "@/shared/config/routes/AppUrls";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import styles from "./AdminOfferWhereForm.module.scss";

interface AdminOfferWhereFields {
    address: AddressFormInput;
}

interface AdminOfferWhereFormProps {
    className?: string;
    offerId: string;
}

export const AdminOfferWhereForm: FC<AdminOfferWhereFormProps> = (props) => {
    const { className, offerId } = props;

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<AdminOfferWhereFields>({
        mode: "onChange",
        defaultValues: {
            address: {
                address: "",
                geoObject: null,
            },
        },
    });

    const { t, ready } = useTranslation("offer");
    const { locale } = useLocale();
    const { id } = useParams();
    const [toast, setToast] = useState<ToastAlert>();

    const onSubmit = handleSubmit(async () => {
        setToast(undefined);
    });

    const handleCoordinatesChange = (coordinates: string | undefined) => {
        if (coordinates) return coordinates;
    };

    if (!ready) {
        return (
            <form className={className} onSubmit={onSubmit}>
                <MiniLoader />
            </form>
        );
    }

    return (
        <form className={className} onSubmit={onSubmit}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <Controller
                control={control}
                name="address"
                rules={{
                    validate: (value) => value?.geoObject !== null || "Укажите пожалуйста адрес",
                }}
                render={({ field }) => (
                    <MapWithAddress
                        field={field}
                        onCoordinatesChange={handleCoordinatesChange}
                    />
                )}
            />
            {errors.address && (
                <p className={styles.error}>{errors.address.message}</p>
            )}
            <div className={styles.buttons}>
                <Button
                    variant="FILL"
                    color="BLUE"
                    size="MEDIUM"
                    className={styles.btn}
                    onClick={onSubmit}
                    type="submit"
                >
                    {t("Сохранить")}
                </Button>
                <ButtonLink path={getAdminVacancyWhenPageUrl(locale, id ?? "")} size="MEDIUM" type="outlined">{t("Дальше")}</ButtonLink>
            </div>
        </form>
    );
};
