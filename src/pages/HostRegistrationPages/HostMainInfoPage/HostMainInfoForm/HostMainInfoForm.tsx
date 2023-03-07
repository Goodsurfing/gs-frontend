import { Form } from "@/hoc/Form/Form";
import React, { FC } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import YMapWithAddress from "@/components/Ymaps/YMapWithAddress/YMapWithAddress";
import Button from "@/components/ui/Button/Button";
import { Variant } from "@/components/ui/Button/Button.interface";
import Input from "@/components/ui/Input/Input";

import styles from "./HostMainInfoForm.module.scss";
import HostMainInfoOrganization from "./HostMainInfoOrganization/HostMainInfoOrganization";
import HostMainInfoSocial from "./HostMainInfoSocial/HostMainInfoSocial";

const HostMainInfoForm: FC = () => {
    const onSubmit = (data: any) => console.log(data);

    const { control, reset, handleSubmit } = useForm({
        mode: "onChange",
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.wrapper}>

            <YMapWithAddress control={control} />
            <HostMainInfoOrganization control={control} />
            <HostMainInfoSocial control={control} />
            <Button
                className={styles.button}
                variant={Variant.PRIMARY}
                rounded={true}
                type="submit"
            >
                Сохранить
            </Button>
        </form>
    );
};

export default React.memo(HostMainInfoForm);
