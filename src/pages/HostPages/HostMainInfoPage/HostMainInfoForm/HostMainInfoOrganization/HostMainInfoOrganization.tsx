import Input from "@/UI/Input/Input";
import Textarea from "@/UI/Textarea/Textarea";
import React, { FC } from "react";
import { Control, Controller } from "react-hook-form";

import SelectField from "@/components/SelectField/SelectField";

import { IOption } from "@/types/select";

import {
    IHostInfoForm,
    IHostMainInfoOrganizationForm,
} from "../HostMainInfoForm.interface";
import { organizations } from "./HostMainInfoOrganization.data";
import styles from "./HostMainInfoOrganization.module.scss";

interface IHostMainInfoOrganization {
    control: Control<IHostInfoForm>;
    data: IHostMainInfoOrganizationForm;
}

const HostMainInfoOrganization: FC<IHostMainInfoOrganization> = ({
    control,
    data,
}) => {
    return (
        <div className={styles.wrapper}>
            <Controller
                control={control}
                name="name"
                defaultValue={data.name || ""}
                render={({ field }) => (
                    <Input
                        id="organizationName"
                        className={styles.organization}
                        label="Название организации"
                        value={field.value}
                        onChange={(e) => field.onChange(e)}
                    />
                )}
            />
            <Controller
                control={control}
                name="description"
                defaultValue={data.description || ""}
                render={({ field }) => (
                    <Textarea
                        className={styles.description}
                        label="Опишите организацию в одно предложение"
                        value={field.value}
                        onChange={(e) => field.onChange(e)}
                    />
                )}
            />
            <div className={styles.organizationTypeWrapper}>
                <Controller
                    control={control}
                    name="type"
                    defaultValue={data.type || ""}
                    render={({ field: { onChange, value, name } }) => (
                        <SelectField
                            name={name}
                            options={organizations}
                            value={organizations.find((organization) => {
                                return organization.value === value;
                            })}
                            onChange={(selectedOption) => {
                                onChange((selectedOption as IOption).value);
                            }}
                            label="Тип организации"
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="otherType"
                    defaultValue=""
                    render={({ field }) => (
                        <Input
                            id="otherType"
                            name={field.name}
                            className={styles.other}
                            label="Другое"
                            value={field.value}
                            onChange={(e) => field.onChange(e)}
                        />
                    )}
                />
            </div>
            <Controller
                control={control}
                name="website"
                defaultValue={data.website || ""}
                render={({ field }) => (
                    <Input
                        label="Сайт организации"
                        className={styles.website}
                        id="website"
                        value={field.value}
                        onChange={(e) => field.onChange(e)}
                    />
                )}
            />
            <Controller
                control={control}
                name="organizationFullDescription"
                defaultValue=""
                render={({ field }) => (
                    <Textarea
                        id="organizationFullDescription"
                        className={styles.website}
                        description="Расскажите о вас, вашей команде и почему волонтёры должны выбрать вас для участия"
                        label="Расскажите об организации"
                        value={field.value}
                        onChange={(e) => field.onChange(e)}
                    />
                )}
            />
        </div>
    );
};

export default React.memo(HostMainInfoOrganization);
