import React, { FC, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import HintPopup from "components/HintPopup/HintPopup";
import {
  HintType,
  IHintPopup,
} from "components/HintPopup/HintPopup.interface";
import Preloader from "components/Preloader/Preloader";
import YMapWithAddress from "components/Ymaps/YMapWithAddress/YMapWithAddress";
import { organizationApi } from "store/api/organizationApi";
import { userInfoApi } from "store/api/userInfoApi";
import { userOrganizationInfoApi } from "store/api/userOrganizationInfoApi";

import ProfileInput from "widgets/ProfileInput/ProfileInput";

import { OrganizationResponseType, OrganizationType } from "shared/types/api/organization";
import { IOrganizationRegistrationParams } from "shared/types/api/organization/organizationRegistration.interface";
import { Button, Variant } from "shared/ui/Button";

import HostMainInfoOrganization from "../../HostPages/HostMainInfoPage/HostMainInfoForm/HostMainInfoOrganization/HostMainInfoOrganization";
import HostMainInfoSocial from "../../HostPages/HostMainInfoPage/HostMainInfoForm/HostMainInfoSocial/HostMainInfoSocial";

import { IHostInfoForm } from "./HostMainInfoForm.interface";
import styles from "./HostMainInfoForm.module.scss";

const HostMainInfoForm: FC = () => {
  const [getInfo] = userInfoApi.useLazyGetUserInfoQuery();
  const [getOrganization, organizationResults] = userOrganizationInfoApi.useLazyGetUserOrganizationInfoQuery();

  const [savedOrganizationData, setSavedOrganizationData] = useState<OrganizationResponseType>();

  const [isOrganizationExists, setOrganizationExists] = useState<boolean>(false);

  useEffect(() => {
    getInfo().then((userInfo) => {
      if (
        userInfo.data?.organizations
                && userInfo.data.organizations.length > 0
      ) {
        const organizationId = userInfo.data.organizations[0].id;
        getOrganization(organizationId)
          .then((res) => {
            if (res.data) {
              const savedData: OrganizationResponseType = {
                id: res.data.id,
                name: res.data.name,
                description: res.data.description,
                address: res.data.address,
                vk: res.data.vk,
                instagram: res.data.instagram,
                facebook: res.data.facebook,
                telegram: res.data.telegram,
                type: res.data.type,
                website: res.data.website,
              };
              setOrganizationExists(true);
              setSavedOrganizationData(savedData);
            }
          })
          .catch((res) => console.log(res));
      } else {
        const savedData: OrganizationResponseType = {
          id: "",
          name: "",
          description: "",
          address: "",
          vk: "",
          instagram: "",
          facebook: "",
          telegram: "",
          type: "",
          website: "",
        };
        setOrganizationExists(false);
        setSavedOrganizationData(savedData);
      }
    });
  }, []);

  console.log(savedOrganizationData);

  const [registerOrganization, { isError }] = organizationApi.useRegisterOrganizationMutation();
  const [bindOrganization, { isSuccess }] = organizationApi.useBindOrganizationMutation();
  const [
    updateOrganization,
    { isError: isUpdateError, isSuccess: isUpdateSuccess },
  ] = organizationApi.useUpdateOrganizationMutation();

  const [hint, setHint] = useState<Pick<IHintPopup, "text" | "type">>();
  const [file, setFile] = useState<File>();

  const onSubmit: SubmitHandler<IHostInfoForm> = async (data) => {
    const preparedData: IOrganizationRegistrationParams = {
      name: data.name,
      description: data.description,
      address: data.address,
      vk: data.vk,
      instagram: data.instagram,
      facebook: data.facebook,
      telegram: data.telegram,
      type: data.type,
      website: data.website,
    };

    if (isOrganizationExists && savedOrganizationData) {
      updateOrganization(savedOrganizationData)
        .unwrap()
        .then(() => {
          setHint({
            type: HintType.Success,
            text: "Организация успешно обновлена",
          });
        })
        .catch(() => {
          setHint({
            type: HintType.Error,
            text: "Не удалось обновить организацию",
          });
        });
    } else {
      console.log("doest not exists");
      registerOrganization(preparedData)
        .unwrap()
        .then((organization) => {
          bindOrganization({
            uuid: organization.id,
            name: organization.name,
            description: organization.description,
            address: organization.address,
            vk: organization.vk,
            instagram: organization.instagram,
            facebook: organization.facebook,
            telegram: organization.telegram,
            type: organization.type,
            website: organization.website,
          })
            .then(() => {
              console.log("success creating otganization");
              setHint({
                text: "Организация успешно создана",
                type: HintType.Success,
              });
            })
            .catch(() => {
              setHint({
                text: "Не удалось привязать организацию",
                type: HintType.Error,
              });
              console.error("Не удалось привязать организацию");
            });
        })
        .catch(() => {
          console.error("Не удалось создать организацию");
          setHint({
            text: "Не удалось создать организацию",
            type: HintType.Error,
          });
        });
    }
  };

  const { control, handleSubmit } = useForm<IHostInfoForm>({
    mode: "onChange",
  });

  if (organizationResults.isLoading) {
    return <Preloader />;
  }

  if (organizationResults.isError) {
    return (
        <div>
            <p>Произошла ошибка!</p>
        </div>
    );
  }

  if (savedOrganizationData) {
    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.wrapper}>
            {isError && hint && (
            <HintPopup type={hint.type} text={hint.text} />
            )}
            {isSuccess && hint && (
            <HintPopup type={HintType.Success} text={hint.text} />
            )}
            {isUpdateSuccess && hint && (
            <HintPopup type={hint.type} text={hint.text} />
            )}
            {isUpdateError && hint && (
            <HintPopup type={hint.type} text={hint.text} />
            )}
            <div className={styles.container}>
                <YMapWithAddress
                    height="300px"
                    data={{
                      address: savedOrganizationData.address,
                    }}
                    control={control}
                />
                <HostMainInfoOrganization
                    data={{
                      name: savedOrganizationData.name,
                      description: savedOrganizationData.description,
                      type: savedOrganizationData.type,
                      website: savedOrganizationData.website,
                    }}
                    control={control}
                />
                <HostMainInfoSocial
                    data={{
                      vk: savedOrganizationData.vk,
                      facebook: savedOrganizationData.facebook,
                      telegram: savedOrganizationData.telegram,
                      instagram: savedOrganizationData.instagram,
                    }}
                    control={control}
                />
                <Button
                    className={styles.button}
                    variant={Variant.PRIMARY}
                    rounded
                    type="submit"
                >
                    Сохранить
                </Button>
            </div>
            <ProfileInput
                fileClassname={styles.fileInput}
                className={styles.file}
                id="host-file"
                file={file}
                setFile={setFile}
                route="profile/info"
            />
        </form>
    );
  }

  return null;
};

export default React.memo(HostMainInfoForm);