import {
    memo, useCallback, useEffect, useState,
} from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { MapWithAddress } from "@/features/MapWithAddress";
import { getGeoObjectByCoordinates } from "@/features/MapWithAddress/model/services/getGeoObjectCollection/getGeoObjectCollection";
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
import { ConfirmActionModal } from "@/shared/ui/ConfirmActionModal/ConfirmActionModal";
import { useConfirmNavigation } from "@/shared/hooks/useConfirmNavigation";
import { ErrorType } from "@/types/api/error";
import { getErrorText } from "@/shared/lib/getErrorText";
import { CHANGES_NOT_SAVED, EXIT_WITHOUT_SAVE, SAVE } from "@/shared/constants/messages";

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
                reset({ address: { address: `${geoObject.description} ${geoObject.name}`, geoObject } });
            }
        } else {
            reset();
        }
    }, [trigger, id, offerData?.where, reset]);

    const onSubmit = handleSubmit(async (data) => {
        setToast(undefined);
        const preparedData = addressFormApiAdapter(data);
        updateOffer({ id: Number(id), body: { where: preparedData } }).unwrap()
            .then(() => {
                fetchGeoObject();
                setToast({
                    text: "Адрес успешно изменён",
                    type: HintType.Success,
                });
            })
            .catch((error: ErrorType) => {
                setToast({
                    text: getErrorText(error),
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

    const {
        isModalOpen,
        handleConfirmClick,
        handleModalClose,
    } = useConfirmNavigation(onSubmit, isDirty);

    if (isLoadingGetData) {
        return <Preloader className={styles.loading} />;
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
            <ConfirmActionModal
                description={CHANGES_NOT_SAVED}
                onConfirm={handleConfirmClick}
                onClose={handleModalClose}
                confirmTextButton={SAVE}
                cancelTextButton={EXIT_WITHOUT_SAVE}
                isModalOpen={isModalOpen}
            />
        </form>
    );
});
