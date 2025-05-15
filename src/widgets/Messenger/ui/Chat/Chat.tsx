import cn from "classnames";
import React, {
    FC, Fragment, useCallback, useEffect, useState,
} from "react";
import { Controller, DefaultValues, useForm } from "react-hook-form";
import InfiniteScroll from "react-infinite-scroll-component";
import { ReactSVG } from "react-svg";
import { useNavigate } from "react-router-dom";
import { ErrorType } from "@/types/api/error";
import { useAuth } from "@/routes/model/guards/AuthProvider";

import { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";

import { OfferApplication, UserSettings } from "@/features/Messenger";

import { FormApplicationStatus, useCreateApplicationFormMutation } from "@/entities/Application";
import { useLazyGetApplicationFormByIdQuery, useUpdateApplicationFormStatusByIdMutation } from "@/entities/Application/api/applicationApi";
import { useGetChatQuery, useReadMessageMutation } from "@/entities/Chat/api/chatApi";
import { useGetChatMessages } from "@/entities/Chat/lib/useGetChatMessages";
import { Host, useLazyGetHostByIdQuery } from "@/entities/Host";
import { UserInfoCard } from "@/entities/Messenger";
import { Offer, useLazyGetOfferByIdQuery } from "@/entities/Offer";
import { useGetProfileInfoQuery } from "@/entities/Profile";
import { useLazyGetVolunteerByIdQuery, VolunteerApi } from "@/entities/Volunteer";

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
import styles from "./Chat.module.scss";
import { API_BASE_URL } from "@/shared/constants/api";
import { getMessengerPageIdUrl } from "@/shared/config/routes/AppUrls";

interface ChatProps {
    id?: string;
    offerId?: string;
    onBackButton: (value?: string) => void;
    className?: string;
    locale: Locale;
}

const defaultValues: DefaultValues<ChatFormFields> = {
    applicationForm: {
        endDate: undefined,
        startDate: undefined,
    },
};

export const Chat: FC<ChatProps> = (props) => {
    const {
        id, offerId, className, onBackButton, locale,
    } = props;

    const { handleSubmit, control, reset } = useForm<ChatFormFields>({
        mode: "onChange",
        defaultValues,
    });

    const isChatCreate = id === "create";
    const [isInfoOpened, setInfoOpened] = useState<boolean>(false);
    const [selectedImage, setSelectedImage] = useState<string | undefined>();
    const [toast, setToast] = useState<ToastAlert>();
    const [offerData, setOfferData] = useState<Offer>();
    const [applicationIsClosed, setApplicationClosed] = useState<boolean>(false);
    const [processedMessages, setProcessedMessages] = useState<JSX.Element[]>(
        [],
    );
    const [organizationData, setOrganizationData] = useState<Host>();
    const [volunteerData, setVolunteerData] = useState<VolunteerApi>();
    const [chatUser, setChatUser] = useState<Host | VolunteerApi>();
    const [isImHost, setImHost] = useState<boolean>(false);
    const navigate = useNavigate();

    const { mercureToken } = useAuth();

    const [getOfferData] = useLazyGetOfferByIdQuery();
    const { data: myProfileData } = useGetProfileInfoQuery();
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
    const [getHost] = useLazyGetHostByIdQuery();
    const [getVolunteer] = useLazyGetVolunteerByIdQuery();

    useEffect(() => {
        if (!myProfileData) return;

        if (
            organizationData?.owner.id
            && organizationData?.owner.id !== myProfileData.id
        ) {
            setChatUser(organizationData);
        } else if (
            volunteerData?.profile.id
            && volunteerData?.profile.id !== myProfileData.id
        ) {
            setChatUser(volunteerData);
        }
    }, [myProfileData, organizationData, volunteerData]);

    useEffect(() => {
        if (chatData) {
            setVolunteerData(chatData.volunteer);
            const volunteerId = chatData.volunteer.profile.id;
            const organizationId = chatData.organization.id;

            const fetchOrganization = async () => {
                const resultOrganizationData = await getHost(organizationId)
                    .unwrap()
                    .then((organizationDataResult) => organizationDataResult)
                    .catch(() => undefined);
                if (resultOrganizationData) {
                    setOrganizationData(resultOrganizationData);
                }
            };

            const fetchVolunteer = async () => {
                const resultVolunteerData = await getVolunteer(volunteerId)
                    .unwrap()
                    .then((volunteerDataResult) => volunteerDataResult)
                    .catch(() => undefined);
                if (resultVolunteerData) {
                    setVolunteerData(resultVolunteerData);
                }
            };

            fetchVolunteer();
            fetchOrganization();
        }
    }, [chatData, getHost, getVolunteer]);

    useEffect(() => {
        if (organizationData && myProfileData) {
            if (organizationData.owner.id === myProfileData.id) {
                setImHost(true);
            }
        }
    }, [organizationData, myProfileData]);

    useEffect(() => {
        if (isChatCreate && offerId) {
            const fetchOffer = async () => {
                const resultOfferData = await getOfferData(offerId)
                    .unwrap()
                    .then((offerDataResult) => offerDataResult)
                    .catch(() => {
                        setToast({
                            text: "Вакансия не была найдена",
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
    }, [isChatCreate, offerId, getOfferData]);

    useEffect(() => {
        if (messages) {
            messages.forEach(async (message, index) => {
                if (index === 0) {
                    readMessage({ message: `${API_BASE_URL}messages/${message.id}` });
                }
            }, []);
        }
    }, [messages, readMessage]);

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

                    const partsAuthor = author.split("/");
                    const authorId = partsAuthor.pop();
                    const isUser = myProfileData?.id !== authorId;

                    let userName;
                    let userAvatar;

                    if (organizationData?.owner.id === authorId) {
                        userName = organizationData?.name;
                        userAvatar = getMediaContent(organizationData?.avatar);
                    } else if (volunteerData?.profile.id === authorId) {
                        userName = `${volunteerData?.profile.lastName} ${volunteerData?.profile.firstName}`;
                        userAvatar = getMediaContent(
                            volunteerData?.profile.image,
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
                            const tempIsHost = (status === "new" && isImHost);

                            return (
                                <OfferApplication
                                    offerData={vacancy}
                                    terms={{
                                        start: new Date(startDate),
                                        end: new Date(endDate),
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
                                isUser={isUser}
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
    }, [messages, getApplicationData, myProfileData,
        locale, volunteerData?.profile.id,
        volunteerData?.profile.firstName, volunteerData?.profile.lastName,
        volunteerData?.profile.image, organizationData?.name,
        organizationData?.avatar, organizationData?.owner.id,
        readMessage, isImHost, onApplicationSubmit]);

    if (!id || !myProfileData) {
        return (
            <div className={cn(styles.wrapper, styles.empty, className)}>
                <ReactSVG src={chatIcon} className={styles.chatIcon} />
                <span>Выберите, кому хотели бы написать</span>
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
                        text: "Заявка успешно отправлена",
                        type: HintType.Success,
                    });
                    setApplicationClosed(true);
                    reset({ applicationForm: data.applicationForm });

                    const chatId = result.chat.split("/").pop();
                    if (chatId) navigate(getMessengerPageIdUrl(locale, chatId));
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
            let username = "";
            if (chatUser && ("profile" in chatUser)) {
                username = `${chatUser.profile.lastName} ${chatUser.profile.firstName}`;
            }

            if (offerData) {
                return (
                    <Controller
                        name="applicationForm"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                            <OfferApplication
                                offerData={offerData}
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
                            {chatUser
                                && ("profile" in chatUser
                                    ? `${chatUser.profile.lastName} ${chatUser.profile.firstName}`
                                    : `${chatUser.name}`)}
                        </span>
                    </div>
                    <div className={styles.settingsInfo}>
                        <UserSettings />
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
                <SendMessage disabled={isChatCreate} chatId={id} onError={onSendMessageError} />
            </div>
            <UserInfoCard
                user={chatUser}
                infoOpenedChange={infoOpenedChange}
                className={cn(styles.userInfo, { [styles.open]: isInfoOpened })}
                locale={locale}
            />
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
