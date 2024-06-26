import { memo, useEffect, useState } from "react";
import {
    Controller,
    DefaultValues,
    FormProvider,
    SubmitHandler,
    useForm,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import cn from "classnames";
import {
    useGetWhoNeedsQuery,
    useUpdateWhoNeedsMutation,
} from "@/entities/Offer/api/offerApi";
import { Age, Languages } from "@/entities/Offer/model/types/offerWhoNeeds";

import Button from "@/shared/ui/Button/Button";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import {
    HintType,
    ToastAlert,
} from "@/shared/ui/HintPopup/HintPopup.interface";
import Input from "@/shared/ui/Input/Input";
import Preloader from "@/shared/ui/Preloader/Preloader";
import Textarea from "@/shared/ui/Textarea/Textarea";

import { MINIMAL_AGE_FOR_VOLUNTEER } from "../../constants";
import {
    offerWhoNeedsApapter,
    offerWhoNeedsApiAdapter,
} from "../../lib/offerWhoNeedsAdapter";
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
    additionalInfo: "",
};

export const WhoNeedsForm = memo(() => {
    const form = useForm<OfferWhoNeedsFields>({
        mode: "onChange",
        defaultValues,
    });
    const { id } = useParams();
    const [updateWnoNeeds, { isLoading }] = useUpdateWhoNeedsMutation();
    const { data: getWhoNeeds, isLoading: isLoadingGetWhoNeedsData } = useGetWhoNeedsQuery({ id: id || "" });
    const { t } = useTranslation("offer");
    const { handleSubmit, control, reset } = form;
    const [toast, setToast] = useState<ToastAlert>();

    useEffect(() => {
        if (getWhoNeeds) {
            reset(offerWhoNeedsApiAdapter(getWhoNeeds));
        }
    }, [getWhoNeeds, reset]);

    const onSubmit: SubmitHandler<OfferWhoNeedsFields> = async (data) => {
        const preparedData = offerWhoNeedsApapter(data);
        setToast(undefined);
        updateWnoNeeds({ body: { id, whoNeeds: preparedData } })
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

    if (isLoadingGetWhoNeedsData) {
        return <Preloader className={styles.loading} />;
    }

    return (
        <FormProvider {...form}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
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
                            className={cn(styles.container, styles.input)}
                            type="number"
                            label={t(
                                "whoNeeds.Сколько волонтерских мест одновременно",
                            )}
                            value={String(field.value)}
                            onChange={(e) => field.onChange(Number(e.target.value))}
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
                            className={cn(styles.container, styles.textarea)}
                            value={field.value}
                            onChange={field.onChange}
                            label={t("whoNeeds.Дополнительная информация")}
                            description={t("whoNeeds.Не более 1000 знаков")}
                            maxLength={1000}
                        />
                    )}
                />
                <Button
                    disabled={isLoading}
                    onClick={handleSubmit(onSubmit)}
                    className={styles.btn}
                    variant="FILL"
                    color="BLUE"
                    size="MEDIUM"
                >
                    {t("whoNeeds.Сохранить")}
                </Button>
            </form>
        </FormProvider>
    );
});
