import { memo } from "react";
import cn from "classnames";

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Profile } from "../../model/types/profile";

import styles from "./ProfileCard.module.scss";
import Preloader from "@/shared/ui/Preloader/Preloader";
import { Text } from "@/shared/ui/Text/Text";
import { ProfileFormFields } from "../../model/types/profileForm";
import Input from "@/shared/ui/Input/Input";
import { InputControl } from "@/shared/ui/InputControl/InputControl";

interface ProfileCardProps {
    className?: string;
    data?: Profile;
    isLoading?: boolean;
    readonly: boolean;
    error?: string;
    onFirstnameChange?: (value?: string) => void;
    onLastnameChange?: (value?: string) => void;
    onBirthdayDayChange?: (value?: string) => void;
    onBirthdatMounthChange?: (value?: string) => void;
    onBirthdayYearChange?: (value?: string) => void;
    onGenderChange?: (value?: string) => void;
    onCountryChange?: (value?: string) => void;
    onCityChange?: (value?: string) => void;
    onLanguageChange?: (value?: string) => void;
    onPhoneChange?: (value?: number) => void;
    onAboutMeChange?: (value?: string) => void;
    onVkChange?: (value?: string) => void;
    onFacebookChange?: (value?: string) => void;
    onInstagramChange?: (value?: string) => void;
    onTelegramChange?: (value?: string) => void;
}

export const ProfileCard = memo((props: ProfileCardProps) => {
    const {
        className,
        readonly,
        data,
        error,
        isLoading,
        onAboutMeChange,
        onBirthdatMounthChange,
        onBirthdayDayChange,
        onBirthdayYearChange,
        onCityChange,
        onCountryChange,
        onFacebookChange,
        onFirstnameChange,
        onGenderChange,
        onInstagramChange,
        onLanguageChange,
        onLastnameChange,
        onPhoneChange,
        onTelegramChange,
        onVkChange,
    } = props;

    const { control, handleSubmit } = useForm<ProfileFormFields>({
        mode: "onChange",
    });

    const onSubmit: SubmitHandler<ProfileFormFields> = (formData) => {
        console.log();
    };

    if (isLoading) {
        return (
            <div className={cn(styles.wrapper, className)}>
                <Preloader />
            </div>
        );
    }

    if (error) {
        <div className={cn(styles.wrapper, className)}>
            <Text
                className={styles.error}
                title="Произошла ошибка"
                text="Попробуйте перезагрузить страницу"
            />
        </div>;
    }

    return (
        <div className={cn(styles.wrapper, className)}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.name}>
                    <InputControl
                        control={control}
                        name="firstname"
                        defaultValue={data?.firstName}
                    />
                    <InputControl
                        control={control}
                        name="lastname"
                        defaultValue={data?.firstName}
                    />
                </div>
                <div className={styles.gender}>
                    <Controller
                        control={control}
                        name="gender"
                    />
                </div>
                <div className={styles.birthDate}>
                    <InputControl
                        control={control}
                        name="birthDay"
                        defaultValue={data?.firstName}
                    />
                    <InputControl
                        control={control}
                        name="birthMounth"
                        defaultValue={data?.firstName}
                    />
                    <InputControl
                        control={control}
                        name="birthYear"
                        defaultValue={data?.firstName}
                    />
                </div>
                <div className={styles.region}>
                    <InputControl
                        control={control}
                        name="country"
                        defaultValue={data?.firstName}
                    />
                    <InputControl
                        control={control}
                        name="city"
                        defaultValue={data?.firstName}
                    />
                    <InputControl
                        control={control}
                        name="language"
                        defaultValue={data?.firstName}
                    />
                </div>
                <div className={styles.phone}>
                    <InputControl
                        type="number"
                        control={control}
                        name="phone"
                        defaultValue={data?.firstName}
                    />
                </div>
                <div className={styles.social} />
            </form>
        </div>
    );
});
