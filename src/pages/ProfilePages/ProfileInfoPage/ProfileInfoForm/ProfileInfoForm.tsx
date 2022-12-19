import React, { FC } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import FileUpload from "@/components/FileUpload/FileUpload";
import InputField from "@/components/InputField/InputField";
import SelectField from "@/components/SelectField/SelectField";
import Button from "@/components/ui/Button/Button";

import {
    days,
    months,
    years,
} from "@/pages/ProfilePages/ProfileInfoPage/ProfileInfoForm/ProfileInfoForm.data";

import styles from "./ProfileInfoForm.module.scss";

interface ProfileInfoFormProps {
    isLocked: boolean;
}

interface IOption {
    value: string;
    label: string;
}

const ProfileInfoForm: FC<ProfileInfoFormProps> = ({ isLocked }) => {
    const { control, handleSubmit } = useForm({
        mode: "onChange",
    });

    const onSubmit: SubmitHandler<any> = (data) => {
        console.log(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.wrapper}>
            <div className={styles.general}>
                <div className={styles.name}>
                    <Controller
                        control={control}
                        name={"name"}
                        defaultValue={"Владислав"}
                        render={({ field }) => (
                            <InputField
                                onChange={(e) => field.onChange(e)}
                                value={field.value}
                                text={"Имя"}
                                type={"text"}
                                disabled={isLocked}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name={"surname"}
                        defaultValue={"Александров"}
                        render={({ field }) => (
                            <InputField
                                onChange={(e) => field.onChange(e)}
                                value={field.value}
                                text={"Фамилия"}
                                type={"text"}
                                disabled={isLocked}
                            />
                        )}
                    />
                </div>
                <div className={styles.avatar}>
                    <FileUpload />
                </div>
            </div>
            <div className={styles.dateOfBirth}>
                <Controller
                    control={control}
                    name={"dayOfBirth"}
                    defaultValue={"1"}
                    render={({ field: { onChange, value, name } }) => (
                        <SelectField
                            placeholder={""}
                            text={"Дата рождения"}
                            name={name}
                            options={days}
                            value={days.find((item) => item.value === value)}
                            onChange={(selectedOption) => {
                                onChange((selectedOption as IOption).value);
                            }}
                            isDisabled={isLocked}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name={"monthOfBirth"}
                    defaultValue={"1"}
                    render={({ field: { onChange, value, name } }) => (
                        <SelectField
                            placeholder={""}
                            name={name}
                            options={months}
                            value={months.find((item) => item.value === value)}
                            onChange={(selectedOption) => {
                                onChange((selectedOption as IOption).value);
                            }}
                            isDisabled={isLocked}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name={"yearOfBirth"}
                    defaultValue={"1992"}
                    render={({ field: { onChange, value, name } }) => (
                        <SelectField
                            placeholder={""}
                            name={name}
                            options={years}
                            value={years.find((item) => item.value === value)}
                            onChange={(selectedOption) => {
                                onChange((selectedOption as IOption).value);
                            }}
                            isDisabled={isLocked}
                        />
                    )}
                />
            </div>
            <div className={styles.contacts}>
                <Controller
                    control={control}
                    name={"email"}
                    defaultValue={"space-cowboy@gmail.com"}
                    render={({ field }) => (
                        <InputField
                            onChange={(e) => field.onChange(e)}
                            value={field.value}
                            text={"E-mail"}
                            type={"text"}
                            disabled={isLocked}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name={"phoneNumber"}
                    defaultValue={"+79827922680"}
                    render={({ field }) => (
                        <InputField
                            onChange={(e) => field.onChange(e)}
                            value={field.value}
                            text={"Телефон"}
                            type={"phone"}
                            disabled={isLocked}
                        />
                    )}
                />
            </div>
            <div className={styles.about}>
                <Controller
                    control={control}
                    name={"about"}
                    defaultValue={"Расскажите о себе"}
                    render={({ field }) => (
                        <InputField
                            onChange={(e) => field.onChange(e)}
                            value={field.value}
                            text={"Расскажите о себе"}
                            type={"text"}
                            disabled={isLocked}
                        />
                    )}
                />
            </div>
            <Button
                type={"submit"}
                variant={"primary"}
                className={styles.button}
            >
                Сохранить
            </Button>
        </form>
    );
};

export default ProfileInfoForm;