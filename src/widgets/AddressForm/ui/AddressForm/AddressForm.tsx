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
import { NavBlockerControl, useNavBlocker } from "@/shared/hooks/useNavBlocker";

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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
    const [isBlocking, setIsBlocking] = useState(false);

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
        updateOffer({ id: Number(id), body: { where: preparedData } })
            .then(() => {
                fetchGeoObject();
                setToast({
                    text: "Адрес успешно изменён",
                    type: HintType.Success,
                });
                setIsBlocking(false);
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

    const handleNavBlock = ({ confirm }: NavBlockerControl) => {
        setConfirmAction(() => confirm);
        setIsBlocking(true);
        setIsModalOpen(true);
    };

    const handleConfirmClick = async () => {
        if (confirmAction) {
            await onSubmit();
            confirmAction();
            setIsBlocking(false);
            setIsModalOpen(false);
        }
    };

    const handleModalClose = () => {
        setIsBlocking(false);
        setIsModalOpen(false);
        setConfirmAction(null);
    };

    useNavBlocker({
        onBlock: handleNavBlock,
        enabled: isDirty && !isBlocking,
    });

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
            {isModalOpen && (
                <ConfirmActionModal
                    description="Изменения не были сохранены"
                    onConfirm={handleConfirmClick}
                    onClose={handleModalClose}
                    confirmTextButton="Сохранить"
                />
            )}
        </form>
    );
});
