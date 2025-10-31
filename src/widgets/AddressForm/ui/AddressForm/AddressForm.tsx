import {
    memo, useCallback, useEffect, useState,
} from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { ErrorType } from "@/types/api/error";

import { MapWithAddress } from "@/features/MapWithAddress";
import { getGeoObjectByCoordinates } from "@/features/MapWithAddress/model/services/getGeoObjectCollection/getGeoObjectCollection";

import {
    useLazyGetOfferByIdQuery,
    useUpdateOfferMutation,
} from "@/entities/Offer/api/offerApi";

import { OFFER_WHERE_FORM } from "@/shared/constants/localstorage";
import { getErrorText } from "@/shared/lib/getErrorText";
import Button from "@/shared/ui/Button/Button";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import {
    HintType,
    ToastAlert,
} from "@/shared/ui/HintPopup/HintPopup.interface";

import { addressFormApiAdapter } from "../../lib/addressFormAdapter";
import { AddressFormFormFields } from "../../model/types/addressForm";
import styles from "./AddressForm.module.scss";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import { getOffersWhenPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";

interface AddressFormProps {
    className?: string;
}

export const AddressForm = memo(({ className }: AddressFormProps) => {
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
    const [updateOffer, { isLoading }] = useUpdateOfferMutation();
    const [trigger, { isLoading: isLoadingGetData, data: offerData }] = useLazyGetOfferByIdQuery();
    const [toast, setToast] = useState<ToastAlert>();

    const fetchGeoObject = useCallback(async () => {
        trigger(id || "").unwrap();
        if (offerData?.where) {
            const offerGeoObject = offerData.where;
            const geoObject = await getGeoObjectByCoordinates(
                offerGeoObject.longitude,
                offerGeoObject.latitude,
            );
            if (geoObject) {
                reset({
                    address: {
                        address: `${geoObject.description}, ${geoObject.name}`,
                        geoObject: {
                            name: geoObject.name,
                            description: geoObject.description,
                            Point: {
                                pos: `${offerGeoObject.longitude} ${offerGeoObject.latitude}`,
                            },
                        },
                    },
                });
            }
        } else {
            reset();
        }
    }, [trigger, id, offerData?.where, reset]);

    useEffect(() => {
        const savedData = sessionStorage.getItem(`${OFFER_WHERE_FORM}${id}`);
        if (savedData) {
            reset(JSON.parse(savedData));
        } else {
            fetchGeoObject();
        }
    }, [fetchGeoObject, id, reset]);

    useEffect(() => {
        if (isDirty) {
            const formData = JSON.stringify(formWatch);
            sessionStorage.setItem(`${OFFER_WHERE_FORM}${id}`, formData);
        }
    }, [isDirty, formWatch, id]);

    const onSubmit = handleSubmit(async (data) => {
        setToast(undefined);
        const preparedData = addressFormApiAdapter(data);
        await updateOffer({ id: Number(id), body: { where: preparedData } })
            .unwrap()
            .then(() => {
                fetchGeoObject();
                setToast({
                    text: "Адрес успешно изменён",
                    type: HintType.Success,
                });
                sessionStorage.removeItem(`${OFFER_WHERE_FORM}${id}`);
            })
            .catch((error: ErrorType) => {
                setToast({
                    text: getErrorText(error),
                    type: HintType.Error,
                });
            });
    });

    const handleCoordinatesChange = (coordinates: string | undefined) => {
        if (coordinates) return coordinates;
    };

    if (isLoadingGetData) {
        return <MiniLoader />;
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
                    disabled={isLoading}
                    color="BLUE"
                    size="MEDIUM"
                    className={styles.btn}
                    onClick={onSubmit}
                    type="submit"
                >
                    {t("where.Сохранить")}
                </Button>
                <ButtonLink path={getOffersWhenPageUrl(locale, id ?? "")} size="MEDIUM" type="outlined">{t("Дальше")}</ButtonLink>
            </div>
        </form>
    );
});
