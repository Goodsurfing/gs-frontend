/* eslint-disable react-hooks/exhaustive-deps */
import cn from "classnames";
import React, {
    FC, Fragment, useCallback, useEffect, useState,
} from "react";
import { Controller, DefaultValues, useForm } from "react-hook-form";
import InfiniteScroll from "react-infinite-scroll-component";
import { ReactSVG } from "react-svg";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ErrorType } from "@/types/api/error";
import { useAuth } from "@/routes/model/guards/AuthProvider";

import { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";

import { OfferApplication } from "@/features/Messenger";

import { FormApplicationStatus } from "@/entities/Application";
import {
    useCreateApplicationFormMutation, useGetChatQuery,
    useLazyGetApplicationFormByIdQuery,
    useReadMessageMutation, useUpdateApplicationFormStatusByIdMutation,
} from "@/entities/Chat/api/chatApi";
import { useGetChatMessages } from "@/entities/Chat/lib/useGetChatMessages";
import { UserInfoCard } from "@/entities/Messenger";
import { Offer, useLazyGetOfferByIdQuery } from "@/entities/Offer";
import { Profile, ProfileById, useLazyGetProfileInfoByIdQuery } from "@/entities/Profile";

import arrowIcon from "@/shared/assets/icons/accordion-arrow.svg";
import arrowBackIcon from "@/shared/assets/icons/arrow.svg";
import chatIcon from "@/shared/assets/icons/chat.svg";
import { formatDate, formatMessageDate } from "@/shared/lib/formatDate";
import { getErrorText } from "@/shared/lib/getErrorText";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import {
    HintType,
    ToastAlert,
} from "@/shared/ui/HintPopup/HintPopup.interface";
import { Modal } from "@/shared/ui/Modal/Modal";

import { applicationOfferAdapter } from "../../lib/applicationOfferAdapter";
import { ChatFormFields } from "../../model/types/chatForm";
import { Message } from "../Message/Message";
import { SendMessage } from "../SendMessage/SendMessage";
import { API_BASE_URL } from "@/shared/constants/api";
import { getMessengerPageIdUrl } from "@/shared/config/routes/AppUrls";
import { useMessenger } from "@/app/providers/MessengerProvider";
import { useGetFullName } from "@/shared/lib/getFullName";
import styles from "./Chat.module.scss";

interface ChatProps {
    id?: string;
    offerId?: string;
    onBackButton: (value?: string) => void;
    className?: string;
    locale: Locale;
    myProfileData: Profile;
    recipientVolunteer?: string;
    recipientOrganization?: string;
}

const defaultValues: DefaultValues<ChatFormFields> = {
    applicationForm: {
        endDate: undefined,
        startDate: undefined,
    },
};

export const Chat: FC<ChatProps> = (props) => {
    const {
        id, offerId, className, onBackButton,
        locale, myProfileData, recipientVolunteer, recipientOrganization,
    } = props;

    const { handleSubmit, control, reset } = useForm<ChatFormFields>({
        mode: "onChange",
        defaultValues,
    });
    const { t } = useTranslation("messenger");

    const isChatCreate = id === "create";
    const [isInfoOpened, setInfoOpened] = useState<boolean>(false);
    const [selectedImage, setSelectedImage] = useState<string | undefined>();
    const [toast, setToast] = useState<ToastAlert>();
    const [offerData, setOfferData] = useState<Offer>();
    const [applicationIsClosed, setApplicationClosed] = useState<boolean>(false);
    const [processedMessages, setProcessedMessages] = useState<JSX.Element[]>(
        [],
    );
    const [companionData, setCompanionData] = useState<ProfileById>();

    const navigate = useNavigate();
    const { getFullName } = useGetFullName();
    const { onReadMessage } = useMessenger();

    const { mercureToken } = useAuth();

    const [getOfferData] = useLazyGetOfferByIdQuery();
    const {
        messages, fetchMoreMessages, hasMore,
    } = useGetChatMessages(
        id,
        mercureToken,
        myProfileData?.id,
    );
    const [createApplicationForm] = useCreateApplicationFormMutation();
    const [updateApplicationStatus] = useUpdateApplicationFormStatusByIdMutation();
    const [readMessage] = useReadMessageMutation();
    const [getApplicationData] = useLazyGetApplicationFormByIdQuery();
    const { data: chatData } = useGetChatQuery(id ?? "");
    const [getProfileData] = useLazyGetProfileInfoByIdQuery();

    useEffect(() => {
        if (chatData) {
            const fetchCompanion = async () => {
                const companionId = chatData.otherParticipants[0].id;
                const resultCompanionData = await getProfileData(companionId)
                    .unwrap()
                    .then((companioDataResult) => companioDataResult)
                    .catch(() => undefined);
                if (resultCompanionData) {
                    setCompanionData(resultCompanionData);
                }
            };

            fetchCompanion();
        }
    }, [chatData]);

    useEffect(() => {
        if (isChatCreate && offerId) {
            const fetchOffer = async () => {
                const resultOfferData = await getOfferData(offerId)
                    .unwrap()
                    .then((offerDataResult) => offerDataResult)
                    .catch(() => {
                        setToast({
                            text: t("Вакансия не была найдена"),
                            type: HintType.Error,
                        });
                        return undefined;
                    });
                if (resultOfferData) {
                    setOfferData(resultOfferData);
                }
            };

            fetchOffer();
        }
        if (isChatCreate && !!recipientVolunteer) {
            const fetchVolunteer = async () => {
                const resultVolunteerData = await getProfileData(recipientVolunteer)
                    .unwrap()
                    .then((volunteerDataResult) => volunteerDataResult)
                    .catch(() => undefined);
                if (resultVolunteerData) {
                    setCompanionData(resultVolunteerData);
                }
            };
            fetchVolunteer();
        }
        // if (isChatCreate && !!recipientOrganization) {
        //     const fetchOrganization = async () => {
        //         const resultHostData = await getProfileData(recipientOrganization)
        //             .unwrap()
        //             .then((hostDataResult) => hostDataResult)
        //             .catch(() => undefined);
        //         if (resultHostData) {
        //             setCompanionData(resultHostData);
        //         }
        //     };
        //     fetchOrganization();
        // }
    }, [isChatCreate, offerId, getOfferData]);

    useEffect(() => {
        if (messages) {
            messages.forEach(async (message, index) => {
                if (index === 0) {
                    await readMessage({ message: `${API_BASE_URL}messages/${message.id}` });
                    onReadMessage();
                }
            }, []);
        }
    }, [messages, onReadMessage, readMessage]);

    const onApplicationSubmit = useCallback(async (
        status: FormApplicationStatus,
        applicationId?: string,
    ) => {
        if (applicationId) {
            await updateApplicationStatus({ status, applicationId });
        }
    }, [updateApplicationStatus]);

    const onImageChange = (src: string) => {
        setSelectedImage(src);
    };

    useEffect(() => {
        const processMessages = async () => {
            let currentDate = "";
            const today = new Date().toDateString();

            const elements = await Promise.all(
                messages.map(async (message) => {
                    const {
                        createdAt, author, text, attachments, applicationForm, id: messageId,
                    } = message;
                    const messageDate = new Date(createdAt).toDateString();

                    const authorId = author.split("/").pop();
                    const isUserCompanion = myProfileData?.id !== authorId;

                    let userName;
                    let userAvatar;

                    if (isUserCompanion) {
                        userName = getFullName(companionData?.firstName, companionData?.lastName);
                        userAvatar = getMediaContent(companionData?.image?.contentUrl);
                    } else {
                        userName = getFullName(
                            myProfileData.firstName,
                            myProfileData.lastName,
                        );
                        userAvatar = getMediaContent(
                            myProfileData.image?.contentUrl,
                        );
                    }

                    let dateLine = null;
                    if (messageDate !== currentDate && messageDate !== today) {
                        currentDate = messageDate;
                        dateLine = (
                            <div className={styles.date}>
                                {formatDate(locale, currentDate)}
                            </div>
                        );
                    }

                    if (applicationForm) {
                        const partsApplicationForm = applicationForm.split("/");
                        const applicationFormId = partsApplicationForm.pop();
                        try {
                            const applicationResult = await getApplicationData(
                                applicationFormId ?? "",
                            ).unwrap();
                            const {
                                vacancy, startDate, endDate, status,
                            } = applicationResult;
                            const volunteerApplicationId = applicationResult.volunteer.profile.id;
                            const isImHost = volunteerApplicationId !== myProfileData.id;
                            const tempIsHost = (status === "new" && isImHost);

                            return (
                                <OfferApplication
                                    offerData={{
                                        id: vacancy.id,
                                        title: vacancy.description?.title,
                                        description: vacancy.description?.description,
                                        shortDescription: vacancy.description?.shortDescription,
                                        imagePath: "",
                                        address: vacancy.where?.address,
                                        status: vacancy.status,
                                        categoryName: "",
                                        acceptedApplicationsCount: vacancy
                                            .acceptedApplicationsCount,
                                        averageRating: vacancy.averageRating,
                                        reviewsCount: vacancy.reviewsCount,
                                    }}
                                    terms={{
                                        start: startDate ? new Date(startDate) : undefined,
                                        end: endDate ? new Date(endDate) : undefined,
                                    }}
                                    isHost={tempIsHost}
                                    username={userName ?? ""}
                                    isClosed
                                    onChange={() => {}}
                                    key={messageId}
                                    onApplicationSubmit={
                                        (statusValue) => onApplicationSubmit(
                                            statusValue,
                                            applicationFormId,
                                        )
                                    }
                                />
                            );
                        } catch {
                            return null;
                        }
                    }

                    return (
                        <Fragment key={messageId}>
                            <Message
                                avatar={userAvatar ?? ""}
                                date={formatMessageDate(locale, createdAt)}
                                isUser={isUserCompanion}
                                text={text}
                                attachments={attachments}
                                username={userName ?? ""}
                                onImageClick={onImageChange}
                            />
                            {dateLine}
                        </Fragment>
                    );
                }),
            );

            setProcessedMessages(
                elements.filter((el): el is JSX.Element => el !== null),
            );
        };

        processMessages();
    }, [messages, getApplicationData, myProfileData, locale,
        readMessage, onApplicationSubmit]);

    if (!id || !myProfileData) {
        return (
            <div className={cn(styles.wrapper, styles.empty, className)}>
                <ReactSVG src={chatIcon} className={styles.chatIcon} />
                <span>{t("Выберите, кому хотели бы написать")}</span>
            </div>
        );
    }

    const infoOpenedChange = () => {
        setInfoOpened((prev) => !prev);
    };

    const onClosePopup = () => {
        setSelectedImage(undefined);
    };

    const handleBackButton = () => {
        onBackButton(undefined);
    };

    const onSendMessageError = (error: string) => {
        setToast(undefined);
        setTimeout(() => {
            setToast({
                text: error,
                type: HintType.Error,
            });
        }, 0);
    };

    const handleVolunteerSubmitOfferApplication = handleSubmit(async (data) => {
        const {
            applicationForm: { startDate, endDate },
        } = data;
        if (startDate !== undefined && endDate !== undefined && offerId) {
            setToast(undefined);
            const preparedData = applicationOfferAdapter(data, offerId);
            await createApplicationForm(preparedData)
                .unwrap()
                .then((result) => {
                    setToast({
                        text: t("Заявка успешно отправлена"),
                        type: HintType.Success,
                    });
                    setApplicationClosed(true);
                    reset({ applicationForm: data.applicationForm });

                    const { chat } = result;
                    if (chat) {
                        const chatId = chat.split("/").pop();
                        if (chatId) navigate(getMessengerPageIdUrl(locale, chatId));
                    }
                })
                .catch((error: ErrorType) => {
                    setToast({
                        text: getErrorText(error),
                        type: HintType.Error,
                    });
                });
        }
    });

    const renderChat = () => {
        if (isChatCreate && offerId) {
            const username = getFullName(companionData?.firstName, companionData?.lastName);

            if (offerData) {
                const {
                    id: offerDataId, where, description, status,
                    acceptedApplicationsCount, averageRating, reviewsCount,
                } = offerData;
                const imagePath = typeof description?.image === "string" ? description.image : description?.image?.contentUrl;
                const categoryTemp = description?.categories ? description.categories[0].name : "";

                return (
                    <Controller
                        name="applicationForm"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                            <OfferApplication
                                offerData={{
                                    id: offerDataId,
                                    address: where?.address,
                                    title: description?.title,
                                    shortDescription: description?.shortDescription,
                                    status,
                                    imagePath: imagePath ?? "",
                                    categoryName: categoryTemp,
                                    acceptedApplicationsCount,
                                    description: description?.description,
                                    averageRating: averageRating ?? 0,
                                    reviewsCount: reviewsCount ?? 0,
                                }}
                                terms={{
                                    start: value.startDate,
                                    end: value.endDate,
                                }}
                                onChange={({ start, end }) => onChange({
                                    ...value,
                                    startDate: start,
                                    endDate: end,
                                })}
                                isHost={false}
                                username={username}
                                isClosed={applicationIsClosed}
                                onSubmit={handleVolunteerSubmitOfferApplication}
                            />
                        )}
                    />
                );
            }
        }
        return processedMessages;
    };

    return (
        <div className={cn(styles.wrapper, className)}>
            {toast && (
                <HintPopup text={toast.text} type={toast.type} timeout={6000} />
            )}
            <div style={{
                flex: 1, display: "flex", flexDirection: "column", height: "100%",
            }}
            >
                <div className={styles.topTab}>
                    <div className={styles.topInner}>
                        <ReactSVG
                            src={arrowBackIcon}
                            className={styles.back}
                            onClick={handleBackButton}
                        />
                        <span className={styles.userName}>
                            {getFullName(companionData?.firstName, companionData?.lastName)}
                        </span>
                    </div>
                    <div className={styles.settingsInfo}>
                        {/* <UserSettings /> */}
                        <ReactSVG
                            src={arrowIcon}
                            className={styles.openInfo}
                            onClick={() => setInfoOpened((prev) => !prev)}
                        />
                    </div>
                </div>
                <div className={styles.chat}>
                    <InfiniteScroll
                        className={styles.infiniteScroll}
                        dataLength={messages.length}
                        next={fetchMoreMessages}
                        hasMore={hasMore}
                        loader={null}
                        height="100%"
                        scrollableTarget="chat"
                        inverse
                        style={{ width: "100%" }}
                    >
                        {renderChat()}
                    </InfiniteScroll>
                </div>
                <SendMessage
                    disabled={isChatCreate && !!offerId}
                    chatId={id}
                    recipientVolunteer={recipientVolunteer}
                    recipientOrganization={recipientOrganization}
                    onError={onSendMessageError}
                    locale={locale}
                />
            </div>
            {companionData && (
                <UserInfoCard
                    user={companionData}
                    infoOpenedChange={infoOpenedChange}
                    className={cn(styles.userInfo, { [styles.open]: isInfoOpened })}
                    locale={locale}
                />
            )}
            {selectedImage && (
                <Modal onClose={onClosePopup}>
                    <img
                        src={selectedImage}
                        className={styles.imagePopup}
                        alt=""
                    />
                </Modal>
            )}
        </div>
    );
};
