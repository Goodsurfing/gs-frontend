import {
    memo, useEffect,
} from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { MapWithAddress } from "@/features/MapWithAddress";

import { OFFER_WHERE_FORM } from "@/shared/constants/localstorage";
import Button from "@/shared/ui/Button/Button";

import { AddressFormFormFields } from "../model/types/addressForm";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { ErrorText } from "@/shared/ui/ErrorText/ErrorText";
import styles from "./OfferWhereForm.module.scss";

interface OfferWhereFormProps {
    offerId: string;
    className?: string;
    initialData: AddressFormFormFields | null;
    onComplete: (data: AddressFormFormFields) => void;
    onFormChange: (isDirty: boolean) => void;
    isLoadingGetData: boolean;
    isLoadingUpdateData: boolean;
    linkNext: string;
    hasUnsavedChanges: boolean;
}

export const OfferWhereForm = memo((props: OfferWhereFormProps) => {
    const {
        offerId, className, initialData,
        isLoadingGetData, isLoadingUpdateData,
        hasUnsavedChanges, linkNext,
        onComplete, onFormChange,
    } = props;

    const {
        handleSubmit,
        formState: { errors, isDirty },
        control,
        reset,
        watch,
    } = useForm<AddressFormFormFields>({
        mode: "onChange",
        defaultValues: {
            address: {
                address: "",
                geoObject: null,
            },
        },
    });

    const { t } = useTranslation("offer");

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        }
    }, [initialData, reset]);

    useEffect(() => {
        onFormChange(isDirty);
        if (isDirty) {
            sessionStorage.setItem(`${OFFER_WHERE_FORM}${offerId}`, JSON.stringify(watch()));
        }
    }, [isDirty, offerId, onFormChange, watch]);

    const onSubmit = handleSubmit(onComplete);

    if (isLoadingGetData) {
        return (
            <div className={className}>
                <MiniLoader />
                ;
            </div>
        );
    }

    return (
        <form className={className} onSubmit={onSubmit}>
            <Controller
                control={control}
                name="address"
                rules={{
                    validate: (value) => value?.geoObject !== null || t("where.Укажите пожалуйста адрес"),
                }}
                render={({ field }) => (
                    <MapWithAddress
                        field={field}
                        onCoordinatesChange={(coords) => coords}
                    />
                )}
            />
            {errors.address && (
                <p className={styles.error}>{errors.address.message}</p>
            )}
            <div className={styles.buttonsWrapper}>
                {hasUnsavedChanges && (
                    <ErrorText text={t("У вас есть несохраненные изменения")} />
                )}
                <div className={styles.buttons}>
                    <Button
                        variant="FILL"
                        disabled={isLoadingUpdateData}
                        color="BLUE"
                        size="MEDIUM"
                        className={styles.btn}
                        onClick={onSubmit}
                        type="submit"
                    >
                        {t("Сохранить")}
                    </Button>
                    <ButtonLink
                        path={linkNext}
                        size="MEDIUM"
                        type="outlined"
                    >
                        {t("Дальше")}
                    </ButtonLink>
                </div>
            </div>
        </form>
    );
});
