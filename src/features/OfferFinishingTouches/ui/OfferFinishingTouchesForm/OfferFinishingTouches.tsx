import { FormControlLabel, Typography } from "@mui/material";
import cn from "classnames";
import { memo, useState } from "react";
import {
    Controller,
    DefaultValues,
    SubmitHandler,
    useForm,
} from "react-hook-form";
import { useParams } from "react-router-dom";

import { useUpdateFinishingTouchesMutation, useUpdateStatusMutation } from "@/entities/Offer/api/offerApi";

import Button from "@/shared/ui/Button/Button";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import {
    HintType,
    ToastAlert,
} from "@/shared/ui/HintPopup/HintPopup.interface";
import Input from "@/shared/ui/Input/Input";
import SwitchComponent from "@/shared/ui/Switch/Switch";
import Textarea from "@/shared/ui/Textarea/Textarea";

import { offerFinishingTouchesApiAdapter } from "../../lib/offerFinishingTouchesAdapter";
import { OfferFinishingTouchesFormFields } from "../../model/types/offerFinishingTouches";
import { OfferFinishingTouchesExtras } from "../OfferFinishingTouchesExtras/OfferFinishingTouchesExtras";
import { OfferQuestionnaire } from "../OfferQuestionnaire/OfferQuestionnaire";
import styles from "./OfferFinishingTouches.module.scss";

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
        const [updateFinishingTouches, { isLoading }] = useUpdateFinishingTouchesMutation();
        const [updateOfferStatus] = useUpdateStatusMutation();
        const [toast, setToast] = useState<ToastAlert>();
        const { id } = useParams();

        const { handleSubmit, control } = useForm<OfferFinishingTouchesFormFields>({
            mode: "onChange",
            defaultValues,
        });

        const updateFinishingTouchesHandle = (data: OfferFinishingTouchesFormFields) => {
            const preparedData = offerFinishingTouchesApiAdapter(data);
            setToast(undefined);
            updateFinishingTouches({
                body: { id, finishingTouches: preparedData },
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
            updateFinishingTouchesHandle(data);
            updateOfferStatus({ body: { id, status: "open" } })
                .unwrap()
                .catch(() => {
                    setToast({
                        text: "Произошла ошибка публикации",
                        type: HintType.Error,
                    });
                });
            onSuccess?.(data);
        };

        const onDraftHandle: SubmitHandler<OfferFinishingTouchesFormFields> = (data) => {
            updateFinishingTouchesHandle(data);
            updateOfferStatus({ body: { id, status: "empty" } })
                .unwrap()
                .catch(() => {
                    setToast({
                        text: "Произошла ошибка",
                        type: HintType.Error,
                    });
                });
        };

        return (
            <form
                onSubmit={handleSubmit(onSubmit)}
                className={cn(styles.wrapper, className)}
            >
                {toast && <HintPopup text={toast.text} type={toast.type} />}
                <div className={styles.formFields}>
                    <div className={styles.skillsWrapper}>
                        <p className={styles.formTitle}>
                            Дополнительные условия
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
                                            Принимать заявки только от проверенных участников
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
                            Приветственное сообщение
                        </p>
                        <Controller
                            name="welcomeMessage"
                            control={control}
                            render={({ field }) => (
                                <Textarea
                                    label="Данное сообщение будет автоматически отправляться всем соискателям после того, как они нажмут кнопку «Участвовать»."
                                    description="Не более 1000 знаков"
                                    onChange={field.onChange}
                                    value={field.value}
                                />
                            )}
                        />
                    </div>
                    <div className={styles.formField}>
                        <p className={styles.formTitle}>Согласие с правилами</p>
                        <Controller
                            name="rules"
                            control={control}
                            render={({ field }) => (
                                <Textarea
                                    label="Добавьте информацию о правилах и условиях, существующих в вашем предложении, с которым соискатель должен быть ознакомлен в момент, когда он подаёт заявку."
                                    description="Не более 1000 знаков"
                                    onChange={field.onChange}
                                    value={field.value}
                                />
                            )}
                        />
                    </div>
                    <div className={styles.formField}>
                        <p className={styles.formTitle}>Добавить вопросы</p>
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
                                description="Добавить вопрос"
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
                        Опубликовать
                    </Button>
                    <Button onClick={handleSubmit(onDraftHandle)} color="BLUE" size="MEDIUM" variant="OUTLINE">
                        Сохранить в черновики
                    </Button>
                </div>
            </form>
        );
    },
);
