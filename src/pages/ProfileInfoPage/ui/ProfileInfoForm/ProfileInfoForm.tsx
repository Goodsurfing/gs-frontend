import { FC, useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Button from "@/shared/ui/Button/Button";

import Preloader from "@/shared/ui/Preloader/Preloader";
import ProfileInput from "@/components/ProfileInput/ProfileInput";

import useUploadFile from "@/shared/hooks/files/useUploadFile";
import { useAppSelector } from "@/shared/hooks/redux";

import { convertFileToBinary } from "@/shared/utils/files/convertFileToBinary";

import { userInfoApi } from "@/store/api/userInfoApi";

import AboutFormGroup from "./AboutFormGroup/AboutFormGroup";
import ContactsFormGroup from "./ContactsFormGroup/ContactsFormGroup";
import DateOfBirthFormGroup from "./DateOfBirthFormGroup/DateOfBirthFormGroup";
import GenderFormGroup from "./GenderFormGroup/GenderFormGroup";
import GeneralFormGroup from "./GeneralFormGroup/GeneralFormGroup";
import LocationFormGroup from "./LocationFormGroup/LocationFormGroup";
import { IUserInfo, IUserInfoForm } from "./ProfileInfoForm.interface";
import styles from "./ProfileInfoForm.module.scss";
import SocialFormGroup from "./SocialFormGroup/SocialFormGroup";
import { TOKEN_LOCALSTORAGE_KEY } from "@/shared/constants/localstorage";

interface ProfileInfoFormProps {
    isLocked: boolean;
    onSuccess?: () => void;
}

const ProfileInfoForm: FC<ProfileInfoFormProps> = ({ isLocked, onSuccess }) => {
    const {
        data: userInfo,
        isLoading,
        isSuccess,
    } = userInfoApi.useGetUserInfoQuery();

    const [updateUserInfo] = userInfoApi.usePutUserInfoMutation();

    const { control, handleSubmit } = useForm<IUserInfoForm>({
        mode: "onChange",
    });

    const [data, setData] = useState<IUserInfo | null>(null);

    const onSubmit: SubmitHandler<IUserInfoForm> = async (data) => {
        const prepareData: IUserInfo = {
            ...data,
            birthDate: data.birthDate?.toISOString().split("T")[0],
        };
        setData(prepareData);
        onSuccess?.();
    };

    const [file, setFile] = useState<File | undefined>();

    const { token } = JSON.parse(localStorage.getItem(TOKEN_LOCALSTORAGE_KEY));

    async function handleUpdateUserInfo() {
        if (!data) return;
        const { ...otherData } = data;
        if (!file) {
            otherData.imageUuid = userInfo?.imageUuid;
            return updateUserInfo(otherData);
        }

        if (file) {
            const preparedFile = convertFileToBinary(file);
            const imageUuid = await useUploadFile(
                file.name,
                preparedFile,
                token,
            );
            otherData.imageUuid = imageUuid;
            return updateUserInfo(otherData);
        }
    }

    useEffect(() => {
        handleUpdateUserInfo();
    }, [data, handleUpdateUserInfo]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.wrapper}>
            <div className={styles.container}>
                {isLoading && <Preloader />}
                {isSuccess && userInfo && (
                    <>
                        <GeneralFormGroup
                            data={{
                                firstName: userInfo.firstName,
                                lastName: userInfo.lastName,
                            }}
                            control={control}
                            isLocked={isLocked}
                        />
                        <DateOfBirthFormGroup
                            data={{
                                birthDate: new Date(userInfo.birthDate),
                            }}
                            control={control}
                            isLocked={isLocked}
                        />
                        <GenderFormGroup
                            data={{ gender: userInfo.gender }}
                            control={control}
                            isLocked={isLocked}
                        />
                        <LocationFormGroup
                            control={control}
                            isLocked={isLocked}
                        />
                        <ContactsFormGroup
                            data={{
                                email: userInfo.email,
                                phone: userInfo.phone,
                            }}
                            control={control}
                            isLocked={isLocked}
                        />
                        <AboutFormGroup control={control} isLocked={isLocked} />
                        <SocialFormGroup
                            data={{
                                vk: userInfo.vk,
                                telegram: userInfo.telegram,
                                instagram: userInfo.instagram,
                                facebook: userInfo.facebook,
                            }}
                            control={control}
                            isLocked={isLocked}
                        />
                    </>
                )}
                <Button
                    type="submit"
                    color="BLUE"
                    size="MEDIUM"
                    variant="FILL"
                    className={styles.button}
                    disabled={isLocked}
                >
                    Сохранить
                </Button>
            </div>
            <Controller
                control={control}
                name="imageUuid"
                render={({ field: { name } }) => (
                    <ProfileInput
                        file={file}
                        setFile={setFile}
                        disabled={isLocked}
                        id={name}
                        name={name}
                        classname={styles.profileInput}
                    />
                )}
            />
        </form>
    );
};

export default ProfileInfoForm;