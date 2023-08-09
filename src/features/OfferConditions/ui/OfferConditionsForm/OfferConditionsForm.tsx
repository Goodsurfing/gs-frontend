import { memo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { OfferConditionsForm } from "../../model/types/offerConditions";

export const OfferConditionsForm = memo(() => {
    const { t } = useTranslation();

    const { control, handleSubmit } = useForm<OfferConditionsForm>({
        mode: 'onChange',
    });

    const onSubmit: SubmitHandler<OfferConditionsForm> = handleSubmit();

    return (
        <form onSubmit={onSubmit}>

        </form>
    );
});
