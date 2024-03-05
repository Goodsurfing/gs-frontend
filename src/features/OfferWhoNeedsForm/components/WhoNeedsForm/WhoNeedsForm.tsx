import { memo, useState } from "react";
import {
    Controller,
    DefaultValues,
    FormProvider,
    SubmitHandler,
    useForm,
} from "react-hook-form";
import { useParams } from "react-router-dom";

import { useUpdateWhoNeedsMutation } from "@/entities/Offer/api/offerApi";
import { Age, Languages } from "@/entities/Offer/model/types/offerWhoNeeds";

import Button from "@/shared/ui/Button/Button";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import {
    HintType,
    ToastAlert,
} from "@/shared/ui/HintPopup/HintPopup.interface";
import Input from "@/shared/ui/Input/Input";
import Textarea from "@/shared/ui/Textarea/Textarea";

import { MINIMAL_AGE_FOR_VOLUNTEER } from "../../constants";
import { offerWhoNeedsApapter } from "../../lib/offerWhoNeedsAdapter";
import { OfferWhoNeedsFields } from "../../model/types/offerWhoNeeds";
import { AgeComponent } from "../Age/Age";
import { GenderComponent } from "../Gender/Gender";
import LanguagesGroup from "../LanguagesGroup/LanguagesGroup";
import Location from "../Location/Location";
import styles from "./WhoNeedsForm.module.scss";

const ageDefaultValue: Age = { minAge: MINIMAL_AGE_FOR_VOLUNTEER, maxAge: 18 };

const languagesDefaultValue: Languages = [
    { language: "not_matter", level: "not_matter" },
];

const defaultValues: DefaultValues<OfferWhoNeedsFields> = {
    gender: [],
    age: ageDefaultValue,
    languages: languagesDefaultValue,
    receptionPlace: "any",
    volunteerPlaces: 0,
    needAllLanguages: false,
};

export const WhoNeedsForm = memo(() => {
    const form = useForm<OfferWhoNeedsFields>({
        mode: "onChange",
        defaultValues,
    });
    const [updateWnoNeeds, { isError }] = useUpdateWhoNeedsMutation();
    const { handleSubmit, control } = form;
    const [toast, setToast] = useState<ToastAlert>();
    const { id } = useParams();

    const onSubmit: SubmitHandler<OfferWhoNeedsFields> = async (data) => {
        const preparedData = offerWhoNeedsApapter(data);
        await updateWnoNeeds({ body: { id, ...preparedData } })
            .unwrap()
            .then(() => {
                setToast({
                    text: "Данные успешно изменены",
                    type: HintType.Success,
                });
            })
            .catch(() => {
                setToast({
                    text: "Некорректно введены данные",
                    type: HintType.Error,
                });
            });
    };

    return (
        <FormProvider {...form}>
            {isError && toast && (
                <HintPopup text={toast.text} type={toast.type} />
            )}
            <form className={styles.wrapper}>
                <Controller
                    control={control}
                    name="gender"
                    render={({ field }) => (
                        <GenderComponent
                            value={field.value}
                            onChange={field.onChange}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="age"
                    render={({ field }) => (
                        <AgeComponent
                            value={field.value}
                            onChange={field.onChange}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="languages"
                    render={({ field }) => (
                        <LanguagesGroup
                            value={field.value}
                            onChange={field.onChange}
                        />
                    )}
                />
                <Controller
                    name="volunteerPlaces"
                    control={control}
                    render={({ field }) => (
                        <Input
                            className={styles.container}
                            type="number"
                            label="Сколько волонтерских мест одновременно"
                            value={field.value}
                            onChange={field.onChange}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="receptionPlace"
                    render={({ field }) => (
                        <Location
                            value={field.value}
                            onChange={field.onChange}
                        />
                    )}
                />
                <Controller
                    name="additionalInfo"
                    control={control}
                    render={({ field }) => (
                        <Textarea
                            className={styles.container}
                            value={field.value}
                            onChange={field.onChange}
                            label="Дополнительная информация"
                            description="Не более 1000 знаков"
                            maxLength={1000}
                        />
                    )}
                />
                <Button
                    onClick={handleSubmit(onSubmit)}
                    className={styles.btn}
                    variant="FILL"
                    color="BLUE"
                    size="MEDIUM"
                >
                    Сохранить
                </Button>
            </form>
        </FormProvider>
    );
});
