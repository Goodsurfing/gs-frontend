import {
    memo, useCallback, useEffect, useState,
} from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { MapWithAddress } from "@/features/MapWithAddress";
import { getGeoObjectByCoordinates } from "@/features/MapWithAddress/model/services/getGeoObjectCollection/getGeoObjectCollection";

import {
    OfferWhere,
    useGetOfferByIdQuery,
    useUpdateOfferMutation,
} from "@/entities/Offer";

import { OFFER_WHERE_FORM } from "@/shared/constants/localstorage";
import { getErrorText } from "@/shared/lib/getErrorText";
import Button from "@/shared/ui/Button/Button";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import {
    HintType,
    ToastAlert,
} from "@/shared/ui/HintPopup/HintPopup.interface";

import { offerWhereFormApiAdapter } from "../lib/offerWhereFormAdapter";
import { AddressFormFormFields } from "../model/types/addressForm";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import { getOffersWhenPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { ErrorText } from "@/shared/ui/ErrorText/ErrorText";
import styles from "./OfferWhereForm.module.scss";

interface OfferWhereFormProps {
    className?: string;
    offerId: string;
}

export const OfferWhereForm = memo((props: OfferWhereFormProps) => {
    const { offerId, className } = props;

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
    const { t } = useTranslation("offer");
    const { id } = useParams();
    const [toast, setToast] = useState<ToastAlert>();

    const [updateOffer, { isLoading: isLoadingUpdate }] = useUpdateOfferMutation();
    const { data: offerData, isLoading: isLoadingGet } = useGetOfferByIdQuery(offerId);

    const hasSavedDataInSession = useCallback(() => sessionStorage.getItem(`${OFFER_WHERE_FORM}${id}`) !== null, [id]);

    const fetchGeoObject = useCallback(async (data: OfferWhere) => {
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
        const savedData = sessionStorage.getItem(`${OFFER_WHERE_FORM}${id}`);
        if (savedData) {
            reset(JSON.parse(savedData));
        } else if (offerData?.where) {
            fetchGeoObject(offerData.where);
        } else {
            reset();
        }
    }, [fetchGeoObject, id, offerData?.where, reset]);

    useEffect(() => {
        if (isDirty) {
            const formData = JSON.stringify(formWatch);
            sessionStorage.setItem(`${OFFER_WHERE_FORM}${id}`, formData);
        }
    }, [isDirty, formWatch, id]);

    const onSubmit = handleSubmit(async (data) => {
        setToast(undefined);
        const preparedData = offerWhereFormApiAdapter(data);
        try {
            await updateOffer({ id: Number(id), body: { where: preparedData } }).unwrap();
            setToast({
                text: t("where.Адрес успешно изменён"),
                type: HintType.Success,
            });
            sessionStorage.removeItem(`${OFFER_WHERE_FORM}${id}`);
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

    if (isLoadingGet) {
        return (
            <div className={className}>
                <MiniLoader />
                ;
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
                    validate: (value) => value?.geoObject !== null || t("where.Укажите пожалуйста адрес"),
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
                        variant="FILL"
                        disabled={isLoadingUpdate}
                        color="BLUE"
                        size="MEDIUM"
                        className={styles.btn}
                        onClick={onSubmit}
                        type="submit"
                    >
                        {t("Сохранить")}
                    </Button>
                    <ButtonLink
                        path={getOffersWhenPageUrl(locale, id ?? "")}
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
