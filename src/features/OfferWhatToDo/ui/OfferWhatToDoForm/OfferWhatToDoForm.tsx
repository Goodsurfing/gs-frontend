import { memo, useEffect, useState } from "react";
import {
    Controller,
    DefaultValues,
    useForm,
} from "react-hook-form";
import { useTranslation } from "react-i18next";

import { useParams } from "react-router-dom";
import { SkillsForm } from "@/features/SkillsForm";

import Button from "@/shared/ui/Button/Button";
import Textarea from "@/shared/ui/Textarea/Textarea";

import { OfferWhatToDoFormFields } from "../../model/types/offerWhatToDo";
import { WorkingHoursField } from "../WorkingHoursField/WorkingHoursField";
import { offerWhatToDoAdapter, offerWhatToDoApiAdapter } from "../../model/lib/offerWhatToDoAdapter";
import { useGetOfferByIdQuery, useUpdateOfferMutation } from "@/entities/Offer/api/offerApi";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import styles from "./OfferWhatToDoForm.module.scss";
import { useConfirmNavigation } from "@/shared/hooks/useConfirmNavigation";
import { ConfirmActionModal } from "@/shared/ui/ConfirmActionModal/ConfirmActionModal";
import Preloader from "@/shared/ui/Preloader/Preloader";
import { ErrorType } from "@/types/api/error";

interface OfferWhatToDoFormProps {
    onSuccess?: () => void;
}

const defaultValues: DefaultValues<OfferWhatToDoFormFields> = {
    skills: [],
    additionalSkills: [],
    workingHours: { dayOff: 2, hours: 6, timeType: "week" },
    extraInfo: "",
};

export const OfferWhatToDoForm = memo(
    ({ onSuccess }: OfferWhatToDoFormProps) => {
        const {
            handleSubmit, control, reset, formState: { isDirty },
        } = useForm<OfferWhatToDoFormFields>({
            mode: "onChange",
            defaultValues,
        });
        const { id } = useParams();
        const [updateOffer, { isLoading }] = useUpdateOfferMutation();
        const { data: getOfferData, isLoading: isOfferDataLoading } = useGetOfferByIdQuery(id || "");
        const [toast, setToast] = useState<ToastAlert>();

        const { t } = useTranslation("offer");

        const onSubmit = handleSubmit(async (data) => {
            const preparedData = offerWhatToDoApiAdapter(data);
            setToast(undefined);
            updateOffer({ id: Number(id), body: { whatToDo: preparedData } })
                .unwrap()
                .then(() => {
                    setToast({
                        text: "Данные успешно изменены",
                        type: HintType.Success,
                    });
                })
                .catch((error: ErrorType) => {
                    setToast({
                        text: error.data.detail,
                        type: HintType.Error,
                    });
                });
            onSuccess?.();
        });

        const {
            isModalOpen,
            handleConfirmClick,
            handleModalClose,
        } = useConfirmNavigation(onSubmit, isDirty);

        useEffect(() => {
            if (getOfferData?.whatToDo && !Array.isArray(getOfferData.whatToDo)) {
                reset(offerWhatToDoAdapter(getOfferData.whatToDo));
            }
        }, [getOfferData?.whatToDo, reset]);

        if (isOfferDataLoading) {
            return (
                <div className={styles.wrapper}>
                    <Preloader />
                </div>
            );
        }

        return (
            <form onSubmit={onSubmit} className={styles.wrapper}>
                {toast && (
                    <HintPopup text={toast.text} type={toast.type} />
                )}
                <p className={styles.skillsText}>
                    {t("whatToDo.Навыки, которыми должен обладать волонтёр")}
                </p>
                <SkillsForm control={control} />
                <Controller
                    name="workingHours"
                    control={control}
                    render={({ field }) => (
                        <WorkingHoursField
                            value={field.value}
                            onChange={field.onChange}
                        />
                    )}
                />
                <Controller
                    name="extraInfo"
                    control={control}
                    rules={{ required: false, maxLength: 1000 }}
                    render={({ field }) => (
                        <Textarea
                            value={field.value}
                            onChange={field.onChange}
                            label={t("whatToDo.Дополнительная информация")}
                            description={t("whatToDo.Не более 1000 знаков")}
                        />
                    )}
                />
                <div>
                    <Button
                        onClick={onSubmit}
                        disabled={isLoading}
                        variant="FILL"
                        color="BLUE"
                        size="MEDIUM"
                        type="submit"
                    >
                        {t("whatToDo.Сохранить")}
                    </Button>
                </div>
                <ConfirmActionModal
                    description="Изменения не были сохранены"
                    onConfirm={handleConfirmClick}
                    onClose={handleModalClose}
                    confirmTextButton="Сохранить"
                    isModalOpen={isModalOpen}
                />
            </form>
        );
    },
);
