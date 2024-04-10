import {
    memo, useCallback, useEffect, useState,
} from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { MapWithAddress } from "@/features/MapWithAddress";
import { getGeoObject } from "@/features/MapWithAddress/model/services/getGeoObjectCollection/getGeoObjectCollection";
import { useUpdateWhereMutation } from "@/entities/Offer";
import {
    useLazyGetWhereQuery,
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
    const [updateWhere, { isLoading }] = useUpdateWhereMutation();
    const [trigger] = useLazyGetWhereQuery();
    const [toast, setToast] = useState<ToastAlert>();

    const fetchGeoObject = useCallback(async () => {
        const resultWhere = await trigger({ id: id || "" });
        if (resultWhere.data?.address) {
            const geoObject = await getGeoObject(resultWhere.data?.address);
            if (geoObject) {
                reset({ address: { address: resultWhere.data?.address, geoObject } });
            }
        }
    }, [trigger, id, reset]);

    const onSubmit = handleSubmit(async (data) => {
        setToast(undefined);
        const preparedData = addressFormApiAdapter(data);
        updateWhere({ body: { id, where: preparedData } })
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleCoordinatesChange = (coordinates: string | undefined) => {
        if (coordinates) return coordinates;
    };

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
