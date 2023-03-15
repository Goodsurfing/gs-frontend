import React, { FC } from "react";
import { Controller } from "react-hook-form";

import Dropdown from "@/components/ui/Dropdown/Dropdown";
import Input from "@/components/ui/Input/Input";
import Textarea from "@/components/ui/Textarea/Textarea";

import styles from "./HostMainInfoOrganization.module.scss";
import SelectField from "@/components/SelectField/SelectField";
import { organizations } from "./HostMainInfoOrganization.data";
import { IOption } from "@/types/select";

interface IHostMainInfoOrganization {
    control: any;
}

const HostMainInfoOrganization: FC<IHostMainInfoOrganization> = ({
    control,
}) => {
    return (
        <div className={styles.wrapper}>
            <Controller
                control={control}
                name="name"
                defaultValue=""
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
                defaultValue=""
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
                    name="organizationDescriptionType"
                    render={({ field: { onChange, value, name } }) => (
                        <SelectField
                            name={name}
                            options={organizations} 
                            value={organizations.find((organization) => {
                                return organization.value === value;
                            })}
                            onChange={(selectedOption) => {
                                onChange((selectedOption as IOption).value)
                            }}
                            label="Тип организации"
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="organizationOther"
                    defaultValue=""
                    render={({ field }) => (
                        <Input
                            id="organizationOther"
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
                name="organizationWebsite"
                defaultValue=""
                render={({ field }) => (
                    <Input
                        label="Сайт организации"
                        className={styles.website}
                        id="organizationWebsite"
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
