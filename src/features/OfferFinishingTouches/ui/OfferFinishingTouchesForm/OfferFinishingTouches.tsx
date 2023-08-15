import { memo } from "react";

import cn from "classnames";

import {
    Controller, DefaultValues, SubmitHandler, useForm,
} from "react-hook-form";

import { OfferFinishingTouchesFormFields } from "../../model/types/offerFinishingTouches";
import { OfferFinishingTouchesExtras } from "../OfferFinishingTouchesExtras/OfferFinishingTouchesExtras";

import Button from "@/shared/ui/Button/Button";
import Textarea from "@/shared/ui/Textarea/Textarea";

import styles from "./OfferFinishingTouches.module.scss";

interface OfferFinishingTouchesFormProps {
    className?: string;
    onSuccess?: (formData: OfferFinishingTouchesFormFields) => void;
}

const defaultValues: DefaultValues<OfferFinishingTouchesFormFields> = {
    extraConditions: [],
};

export const OfferFinishingTouchesForm = memo((props: OfferFinishingTouchesFormProps) => {
    const { className, onSuccess } = props;

    const { handleSubmit, control } = useForm<OfferFinishingTouchesFormFields>({
        mode: "onChange",
        defaultValues,
    });

    const onSubmit: SubmitHandler<OfferFinishingTouchesFormFields> = (data) => {
        console.log(data);
        onSuccess?.(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={cn(styles.wrapper, className)}>
            <div className={styles.formFields}>
                <div className={styles.skillsWrapper}>
                    <p className={styles.formTitle}>Дополнительные условия</p>
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
                    <p className={styles.formTitle}>Приветственное сообщение</p>
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
                        name="faq"
                        control={control}
                        render={({ field }) => (
                            <Textarea
                                label="Вы можете добавить стандартные вопросы волонтёру или ссылку на анкету, которую он должен заполнить и отправить. Данное сообщение будет автоматически отправляться всем соискателям после того, как они нажмут кнопку «Участвовать»."
                                description="Не более 1000 знаков"
                                onChange={field.onChange}
                                value={field.value}
                            />
                        )}
                    />
                </div>
            </div>
            <div className={styles.submitBtns}>
                <Button
                    color="BLUE"
                    size="MEDIUM"
                    variant="FILL"
                >
                    Опубликовать
                </Button>
                <Button
                    color="BLUE"
                    size="MEDIUM"
                    variant="OUTLINE"
                >
                    Сохранить в черновики
                </Button>
            </div>
        </form>
    );
});
