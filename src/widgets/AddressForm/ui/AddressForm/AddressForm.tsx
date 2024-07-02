import {
    memo, useCallback, useEffect, useState,
} from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { MapWithAddress } from "@/features/MapWithAddress";
import { getGeoObject } from "@/features/MapWithAddress/model/services/getGeoObjectCollection/getGeoObjectCollection";
import {
    useLazyGetOfferByIdQuery,
    useUpdateOfferMutation,
} from "@/entities/Offer/api/offerApi";

import Button from "@/shared/ui/Button/Button";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import {
    HintType,
    ToastAlert,
} from "@/shared/ui/HintPopup/HintPopup.interface";

import { AddressFormFormFields } from "../../model/types/addressForm";
import styles from "./AddressForm.module.scss";
import { addressFormApiAdapter } from "../../lib/addressFormAdapter";
import Preloader from "@/shared/ui/Preloader/Preloader";

interface AddressFormProps {
    className?: string;
}

export const AddressForm = memo(({ className }: AddressFormProps) => {
    const {
        handleSubmit,
        formState: { errors },
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
    const { t } = useTranslation("offer");
    const { id } = useParams();
    const [updateOffer, { isLoading }] = useUpdateOfferMutation();
    const [trigger, { isLoading: isLoadingGetData }] = useLazyGetOfferByIdQuery();
    const [toast, setToast] = useState<ToastAlert>();

    const fetchGeoObject = useCallback(async () => {
        const resultWhere = await trigger(id || "");
        const { data: offerData } = resultWhere;
        if (offerData?.where?.address) {
            const offerAddress = offerData.where.address;
            const geoObject = await getGeoObject(offerAddress);
            if (geoObject) {
                reset({ address: { address: offerAddress, geoObject } });
            }
        }
    }, [trigger, id, reset]);

    const onSubmit = handleSubmit(async (data) => {
        setToast(undefined);
        const preparedData = addressFormApiAdapter(data);
        updateOffer({ id: Number(id), body: { where: preparedData } })
            .then(() => {
                fetchGeoObject();
                setToast({
                    text: "Адрес успешно изменён",
                    type: HintType.Success,
                });
            })
            .catch(() => {
                setToast({
                    text: "Произошла ошибка",
                    type: HintType.Error,
                });
            });
    });

    useEffect(() => {
        fetchGeoObject();
    }, [fetchGeoObject]);

    const handleCoordinatesChange = (coordinates: string | undefined) => {
        if (coordinates) return coordinates;
    };

    if (isLoadingGetData) {
        return <Preloader className={styles.loading} />;
    }

    return (
        <form className={className} onSubmit={onSubmit}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            {errors.address && (
                <p className={styles.error}>{errors.address.message}</p>
            )}
            <Controller
                control={control}
                name="address"
                render={({ field }) => (
                    <MapWithAddress
                        field={field}
                        onCoordinatesChange={handleCoordinatesChange}
                    />
                )}
            />
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
        </form>
    );
});
