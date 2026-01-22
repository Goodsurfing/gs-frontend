import React, {
    FC, useCallback, useEffect, useState,
} from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLocale } from "@/app/providers/LocaleProvider";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { getGeoObjectByCoordinates, MapWithAddress } from "@/features/MapWithAddress";
import Button from "@/shared/ui/Button/Button";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import { getAdminVacancyWhenPageUrl } from "@/shared/config/routes/AppUrls";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import {
    AdminVacancyWhere, offerWhereApiAdapter,
    useGetAdminVacancyWhereQuery, useUpdateAdminVacancyWhereMutation,
} from "@/entities/Admin";
import { OFFER_WHERE_FORM } from "@/shared/constants/localstorage";
import { getErrorText } from "@/shared/lib/getErrorText";
import { ErrorText } from "@/shared/ui/ErrorText/ErrorText";
import { AddressFormFormFields } from "@/features/Offer";
import styles from "./AdminOfferWhereForm.module.scss";

interface AdminOfferWhereFormProps {
    className?: string;
    offerId: string;
}

export const AdminOfferWhereForm: FC<AdminOfferWhereFormProps> = (props) => {
    const { className, offerId } = props;

    const {
        handleSubmit,
        formState: { errors, isDirty },
        control,
        reset,
    } = useForm<AddressFormFormFields>({
        mode: "onChange",
        defaultValues: {
            address: {
                address: "",
                geoObject: null,
            },
        },
    });

    const formWatch = useWatch({ control });

    const { locale } = useLocale();
    const { t, ready } = useTranslation("offer");
    const [toast, setToast] = useState<ToastAlert>();

    const [updateOfferWhere, { isLoading: isLoadingUpdate }] = useUpdateAdminVacancyWhereMutation();
    const { data: offerWhereData, isLoading: isLoadingGet } = useGetAdminVacancyWhereQuery(offerId);

    const hasSavedDataInSession = useCallback(() => sessionStorage.getItem(`${OFFER_WHERE_FORM}${offerId}`) !== null, [offerId]);

    const fetchGeoObject = useCallback(async (data: AdminVacancyWhere) => {
        const geoObject = await getGeoObjectByCoordinates(
            data.longitude,
            data.latitude,
        );
        if (geoObject) {
            reset({
                address: {
                    address: `${geoObject.description}, ${geoObject.name}`,
                    geoObject: {
                        name: geoObject.name,
                        description: geoObject.description,
                        Point: {
                            pos: `${data.longitude} ${data.latitude}`,
                        },
                    },
                },
            });
        }
    }, [reset]);

    useEffect(() => {
        const savedData = sessionStorage.getItem(`${OFFER_WHERE_FORM}${offerId}`);
        if (savedData) {
            reset(JSON.parse(savedData));
        } else if (offerWhereData) {
            fetchGeoObject(offerWhereData);
        } else {
            reset();
        }
    }, [fetchGeoObject, offerId, offerWhereData, reset]);

    useEffect(() => {
        if (isDirty) {
            const formData = JSON.stringify(formWatch);
            sessionStorage.setItem(`${OFFER_WHERE_FORM}${offerId}`, formData);
        }
    }, [formWatch, isDirty, offerId]);

    const onSubmit = handleSubmit(async (data) => {
        setToast(undefined);
        const preparedData = offerWhereApiAdapter(data);
        try {
            await updateOfferWhere({ offerId, body: preparedData });
            setToast({
                text: t("where.Адрес успешно изменён"),
                type: HintType.Success,
            });
        } catch (error: unknown) {
            setToast({
                text: getErrorText(error),
                type: HintType.Error,
            });
        }
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

    if (isLoadingGet) {
        return (
            <div className={className}>
                <MiniLoader />
            </div>
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
            <div className={styles.buttonsWrapper}>
                {hasSavedDataInSession() && (
                    <ErrorText text={t("У вас есть несохраненные изменения")} />
                )}
                <div className={styles.buttons}>
                    <Button
                        disabled={isLoadingUpdate}
                        variant="FILL"
                        color="BLUE"
                        size="MEDIUM"
                        className={styles.btn}
                        onClick={onSubmit}
                        type="submit"
                    >
                        {t("Сохранить")}
                    </Button>
                    <ButtonLink
                        path={getAdminVacancyWhenPageUrl(locale, offerId)}
                        size="MEDIUM"
                        type="outlined"
                    >
                        {t("Дальше")}
                    </ButtonLink>
                </div>
            </div>
        </form>
    );
};
