import { memo } from "react";
import {
    Controller, DefaultValues, SubmitHandler, useForm,
} from "react-hook-form";

import Button from "@/shared/ui/Button/Button";

import { AgeComponent } from "../Age/Age";
import { GenderComponent } from "../Gender/Gender";
import LanguagesGroup from "../LanguagesGroup/LanguagesGroup";
import Location from "../Location/Location";
import { OfferWhoNeedsFields } from "../../lib/offerWhoNeeds";
import { Age, Languages } from "@/entities/Offer/model/types/offerWhoNeeds";
import { MINIMAL_AGE_FOR_VOLUNTEER } from "../../constants";
import styles from "./WhoNeedsForm.module.scss";
import Input from "@/shared/ui/Input/Input";
import Textarea from "@/shared/ui/Textarea/Textarea";

const ageDefaultValue: Age = { minAge: MINIMAL_AGE_FOR_VOLUNTEER, maxAge: 18 };

const languagesDefaultValue: Languages = [{ language: "not_matter", level: "not_matter" }];

const defaultValues: DefaultValues<OfferWhoNeedsFields> = {
    gender: "man",
    age: ageDefaultValue,
    languages: languagesDefaultValue,
    receptionPlace: "any",
    volunteerPlaces: 0,
};

export const WhoNeedsForm = memo(() => {
    const { handleSubmit, control } = useForm<OfferWhoNeedsFields>({
        mode: "onChange",
        defaultValues,
    });

    const onSubmit: SubmitHandler<OfferWhoNeedsFields> = async () => {
    };

    return (
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
    );
});
