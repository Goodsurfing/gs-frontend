import { memo, useEffect, useState } from "react";
import {
    Controller,
    DefaultValues,
    useForm,
    useWatch,
} from "react-hook-form";
import { useParams } from "react-router-dom";

import { useTranslation } from "react-i18next";
import { useGetOfferByIdQuery, useUpdateOfferMutation } from "@/entities/Offer/api/offerApi";

import Button from "@/shared/ui/Button/Button";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import {
    HintType,
    ToastAlert,
} from "@/shared/ui/HintPopup/HintPopup.interface";

import { offerWhenFormAdapter, offerWhenFormApiAdapter } from "../../lib/offerWhenFormAdapter";
import type {
    DatePeriods,
    EndSettings,
    OfferWhenFields,
    TimeSettingsControls,
} from "../../model/types/offerWhen";
import { OfferWhenPeriods } from "../OfferWhenPeriods/OfferWhenPeriods";
import { OfferWhenRequests } from "../OfferWhenRequests/OfferWhenRequests";
import { OfferWhenSlider } from "../OfferWhenSlider/OfferWhenSlider";
import { OfferWhenTimeSettings } from "../OfferWhenTimeSettings/OfferWhenTimeSettings";
import styles from "./OfferWhenForm.module.scss";
import Preloader from "@/shared/ui/Preloader/Preloader";
import { ConfirmActionModal } from "@/shared/ui/ConfirmActionModal/ConfirmActionModal";
import { ErrorType } from "@/types/api/error";
import { getErrorText } from "@/shared/lib/getErrorText";
import { useConfirmNavigation } from "@/shared/hooks/useConfirmNavigation";
import { CHANGES_NOT_SAVED, EXIT_WITHOUT_SAVE, SAVE } from "@/shared/constants/messages";

interface OfferWhenFormProps {
    onComplete?: () => void;
}

export const OfferWhenForm = memo(({ onComplete }: OfferWhenFormProps) => {
    const { id } = useParams();
    const [updateOffer, { isLoading }] = useUpdateOfferMutation();
    const { data: getOfferData, isLoading: isLoadingGetWhenData } = useGetOfferByIdQuery(id || "");
    const [toast, setToast] = useState<ToastAlert>();
    const { t } = useTranslation("offer");

    const initialSliderValue: number[] = [7, 186];
    const initialPeriods: DatePeriods[] = [{ start: undefined, end: undefined }];
    const endSettings: EndSettings = {
        applicationEndDate: new Date(),
        isWithoutApplicationDate: false,
    };
    const timeSettings: TimeSettingsControls = {
        isApplicableAtTheEnd: false,
        isFullYearAcceptable: false,
    };

    const defaultValues: DefaultValues<OfferWhenFields> = {
        participationPeriod: initialSliderValue,
        periods: initialPeriods,
        endSettings,
        timeSettings,
    };
    const {
        handleSubmit, control, reset, formState: { isDirty },
    } = useForm<OfferWhenFields>({
        mode: "onChange",
        defaultValues,
    });

    const watchIsFullYearAcceptable = useWatch({ name: "timeSettings.isFullYearAcceptable", control });
    const watchIsApplicableAtTheEnd = useWatch({ name: "timeSettings.isApplicableAtTheEnd", control });
    const watchPeriods = useWatch({ name: "periods", control });

    const onSubmit = handleSubmit(async (data) => {
        const preparedData = offerWhenFormApiAdapter(data);
        setToast(undefined);
        updateOffer({ id: Number(id), body: { when: preparedData } })
            .unwrap()
            .then(() => {
                setToast({
                    text: "Данные успешно изменены",
                    type: HintType.Success,
                });
            })
            .catch((error: ErrorType) => {
                setToast({
                    text: getErrorText(error),
                    type: HintType.Error,
                });
            });
        onComplete?.();
    });

    useEffect(() => {
        if (getOfferData?.when) {
            reset(offerWhenFormAdapter(getOfferData?.when));
        } else {
            reset();
        }
    }, [getOfferData?.when, reset]);

    const {
        isModalOpen,
        handleConfirmClick,
        handleModalClose,
    } = useConfirmNavigation(onSubmit, isDirty);

    if (isLoadingGetWhenData) {
        return <Preloader className={styles.loading} />;
    }

    return (
        <form className={styles.form}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            {
                !watchIsFullYearAcceptable && (
                    <Controller
                        name="periods"
                        control={control}
                        render={({ field }) => (
                            <OfferWhenPeriods
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />
                )
            }
            <Controller
                name="timeSettings"
                control={control}
                render={({ field }) => (
                    <OfferWhenTimeSettings
                        value={field.value}
                        onChange={field.onChange}
                    />
                )}
            />
            <Controller
                name="participationPeriod"
                control={control}
                render={({ field }) => (
                    <OfferWhenSlider
                        value={field.value}
                        onChange={field.onChange}
                    />
                )}
            />
            <Controller
                name="endSettings"
                control={control}
                render={({ field }) => (
                    <OfferWhenRequests
                        value={field.value}
                        onChange={field.onChange}
                        periods={watchPeriods}
                        isApplicableAtTheEnd={watchIsApplicableAtTheEnd}
                    />
                )}
            />
            <Button
                disabled={isLoading}
                onClick={onSubmit}
                className={styles.btn}
                variant="FILL"
                color="BLUE"
                size="MEDIUM"
            >
                {t("when.Сохранить")}
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
