import { FormControlLabel, Typography } from "@mui/material";
import cn from "classnames";
import { memo, useEffect, useState } from "react";
import {
    Controller,
    DefaultValues,
    SubmitHandler,
    useForm,
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
import Input from "@/shared/ui/Input/Input";
import SwitchComponent from "@/shared/ui/Switch/Switch";
import Textarea from "@/shared/ui/Textarea/Textarea";

import { offerFinishingTouchesAdapter, offerFinishingTouchesApiAdapter } from "../../lib/offerFinishingTouchesAdapter";
import { OfferFinishingTouchesFormFields } from "../../model/types/offerFinishingTouches";
import { OfferFinishingTouchesExtras } from "../OfferFinishingTouchesExtras/OfferFinishingTouchesExtras";
import { OfferQuestionnaire } from "../OfferQuestionnaire/OfferQuestionnaire";
import styles from "./OfferFinishingTouches.module.scss";
import { OfferStatus } from "@/entities/Offer";

interface OfferFinishingTouchesFormProps {
    className?: string;
    onSuccess?: (formData: OfferFinishingTouchesFormFields) => void;
}

const defaultValues: DefaultValues<OfferFinishingTouchesFormFields> = {
    extraConditions: [],
    onlyVerified: false,
    welcomeMessage: "",
    rules: "",
    questionnaireUrl: "",
    questions: "",
};

export const OfferFinishingTouchesForm = memo(
    (props: OfferFinishingTouchesFormProps) => {
        const { className, onSuccess } = props;
        const { id } = useParams();
        const [updateOffer, { isLoading }] = useUpdateOfferMutation();
        const { data: getOfferData } = useGetOfferByIdQuery(id || "");
        const [toast, setToast] = useState<ToastAlert>();
        const { t } = useTranslation("offer");

        const { handleSubmit, control, reset } = useForm<OfferFinishingTouchesFormFields>({
            mode: "onChange",
            defaultValues,
        });

        const updateFinishingTouchesHandle = (
            data: OfferFinishingTouchesFormFields,
            offerStatus: OfferStatus,
        ) => {
            const preparedData = offerFinishingTouchesApiAdapter(data);
            setToast(undefined);
            updateOffer({
                id: Number(id),
                body: {
                    finishingTouches: preparedData,
                    status: offerStatus,
                },
            })
                .unwrap()
                .then(() => {
                    setToast({
                        text: "Данные успешно изменены",
                        type: HintType.Success,
                    });
                })
                .catch(() => {
                    setToast({
                        text: "Произошла ошибка",
                        type: HintType.Error,
                    });
                });
        };

        const onSubmit: SubmitHandler<OfferFinishingTouchesFormFields> = (
            data,
        ) => {
            updateFinishingTouchesHandle(data, "open");
            onSuccess?.(data);
        };

        const onDraftHandle: SubmitHandler<OfferFinishingTouchesFormFields> = (data) => {
            updateFinishingTouchesHandle(data, "empty");
        };

        useEffect(() => {
            if (getOfferData?.finishingTouches) {
                reset(offerFinishingTouchesAdapter(getOfferData.finishingTouches));
            }
        }, [getOfferData?.finishingTouches, reset]);

        return (
            <form
                onSubmit={handleSubmit(onSubmit)}
                className={cn(styles.wrapper, className)}
            >
                {toast && <HintPopup text={toast.text} type={toast.type} />}
                <div className={styles.formFields}>
                    <div className={styles.skillsWrapper}>
                        <p className={styles.formTitle}>
                            {t("finishingTouches.Дополнительные условия")}
                        </p>
                        <Controller
                            name="extraConditions"
                            control={control}
                            render={({ field }) => (
                                <OfferFinishingTouchesExtras
                                    value={field.value}
                                    className={styles.skills}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </div>
                    <div className={styles.formField}>
                        <Controller
                            name="onlyVerified"
                            control={control}
                            render={({ field }) => (
                                <FormControlLabel
                                    label={(
                                        <Typography className={styles.checkbox}>
                                            {t("finishingTouches.Принимать заявки только от проверенных участников")}
                                        </Typography>
                                    )}
                                    control={(
                                        <SwitchComponent
                                            value={field.value}
                                            onClick={field.onChange}
                                        />
                                    )}
                                />
                            )}
                        />
                    </div>
                    <div className={styles.formField}>
                        <p className={styles.formTitle}>
                            {t("finishingTouches.Приветственное сообщение")}
                        </p>
                        <Controller
                            name="welcomeMessage"
                            control={control}
                            render={({ field }) => (
                                <Textarea
                                    label={t("finishingTouches.Данное сообщение будет автоматически отправляться всем соискателям после того, как они нажмут кнопку «Участвовать».")}
                                    description={t("finishingTouches.Не более 1000 знаков")}
                                    onChange={field.onChange}
                                    value={field.value}
                                />
                            )}
                        />
                    </div>
                    <div className={styles.formField}>
                        <p className={styles.formTitle}>{t("finishingTouches.Согласие с правилами")}</p>
                        <Controller
                            name="rules"
                            control={control}
                            render={({ field }) => (
                                <Textarea
                                    label={t("finishingTouches.Добавьте информацию о правилах и условиях, существующих в вашем предложении, с которым соискатель должен быть ознакомлен в момент, когда он подаёт заявку.")}
                                    description={t("finishingTouches.Не более 1000 знаков")}
                                    onChange={field.onChange}
                                    value={field.value}
                                />
                            )}
                        />
                    </div>
                    <div className={styles.formField}>
                        <p className={styles.formTitle}>{t("finishingTouches.Добавить вопросы")}</p>
                        <Controller
                            name="questionnaireUrl"
                            control={control}
                            render={({ field }) => (
                                <OfferQuestionnaire
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </div>
                    <Controller
                        name="questions"
                        control={control}
                        render={({ field }) => (
                            <Input
                                style={{ height: 44 }}
                                description={t("finishingTouches.Добавить вопрос")}
                                onChange={field.onChange}
                                value={field.value}
                            />
                        )}
                    />
                </div>
                <div className={styles.submitBtns}>
                    <Button
                        disabled={isLoading}
                        color="BLUE"
                        size="MEDIUM"
                        variant="FILL"
                        onClick={handleSubmit(onSubmit)}
                    >
                        {t("finishingTouches.Опубликовать")}
                    </Button>
                    <Button onClick={handleSubmit(onDraftHandle)} color="BLUE" size="MEDIUM" variant="OUTLINE">
                        {t("finishingTouches.Сохранить в черновики")}
                    </Button>
                </div>
            </form>
        );
    },
);
