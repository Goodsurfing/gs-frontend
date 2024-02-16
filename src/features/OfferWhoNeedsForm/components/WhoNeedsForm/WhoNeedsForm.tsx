import { memo } from "react";
import {
    Controller, DefaultValues, SubmitHandler, useForm,
} from "react-hook-form";

import Button from "@/shared/ui/Button/Button";

import Age from "../Age/Age";
import { GenderComponent } from "../Gender/Gender";
import LanguagesGroup from "../LanguagesGroup/LanguagesGroup";
import Location from "../Location/Location";
import styles from "./WhoNeedsForm.module.scss";
import { OfferWhoNeedsFields } from "../../lib/offerWhoNeeds";

const defaultValues: DefaultValues<OfferWhoNeedsFields> = {
    gender: "man",
};

export const WhoNeedsForm = memo(() => {
    const { handleSubmit, control } = useForm<OfferWhoNeedsFields>({
        mode: "onChange",
        defaultValues,
    });

    const onSubmit: SubmitHandler<OfferWhoNeedsFields> = async (data) => {
        console.log(data);
        // offerWhoNeedsFormAdapter(data);
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
            <Age />
            <LanguagesGroup />
            <Location />
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
