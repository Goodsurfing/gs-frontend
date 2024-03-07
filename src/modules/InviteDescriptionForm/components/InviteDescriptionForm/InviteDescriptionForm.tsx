import { useState } from "react";
import {
    Controller,
    DefaultValues,
    FormProvider,
    SubmitHandler,
    useForm,
} from "react-hook-form";
import { useParams } from "react-router-dom";
import { useUpdateDescriptionMutation } from "@/entities/Offer/api/offerApi";

import Button from "@/shared/ui/Button/Button";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import {
    HintType,
    ToastAlert,
} from "@/shared/ui/HintPopup/HintPopup.interface";

import { inviteDescriptionApiAdapter } from "../../lib/inviteDescriptionAdapter";
import { OfferDescriptionField } from "../../model/types/inviteDescription";
import Categories from "../Categories/Categories";
import EventName from "../EventName/EventName";
import ExtraImagesUpload from "../ExtraImagesUpload/ExtraImagesUpload";
import FullDescription from "../FullDescription/FullDescription";
import ImageUpload from "../ImageUpload/ImageUpload";
import ShortDescription from "../ShortDescription/ShortDescription";
import styles from "./InviteDescriptionForm.module.scss";

const defaultValues: DefaultValues<OfferDescriptionField> = {
    title: undefined,
    category: [],
    fullDescription: undefined,
    shortDescription: undefined,
    coverImage: undefined,
    images: [],
};

export const InviteDescriptionForm = () => {
    const form = useForm<OfferDescriptionField>({
        mode: "onChange",
        defaultValues,
    });
    const { handleSubmit, control } = form;
    const [updateDescription, { isError, isLoading }] = useUpdateDescriptionMutation();
    const [toast, setToast] = useState<ToastAlert>();
    const { id } = useParams();

    const onSubmit: SubmitHandler<OfferDescriptionField> = async (data) => {
        const preparedData = inviteDescriptionApiAdapter(data);
        console.log(preparedData);
        setToast(undefined);
        updateDescription({ body: { id, description: preparedData } })
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
            <form>
                <div className={styles.formWrapper}>
                    <EventName />
                    <Categories />
                    <ShortDescription />
                    <FullDescription />
                    <ImageUpload />
                    <Controller
                        name="images"
                        control={control}
                        render={({ field }) => (
                            <ExtraImagesUpload
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />
                </div>
                <Button
                    className={styles.btn}
                    disabled={isLoading}
                    variant="FILL"
                    color="BLUE"
                    size="MEDIUM"
                    onClick={handleSubmit(onSubmit)}
                >
                    Сохранить
                </Button>
            </form>
        </FormProvider>
    );
};
