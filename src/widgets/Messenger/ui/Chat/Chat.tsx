import cn from "classnames";
import React, {
    FC, useEffect, useRef, useState,
} from "react";
import { Controller, DefaultValues, useForm } from "react-hook-form";
import { ReactSVG } from "react-svg";
import { ErrorType } from "@/types/api/error";

import { OfferApplication, UserSettings } from "@/features/Messenger";

import { mockedChatUser, UserInfoCard } from "@/entities/Messenger";

import arrowIcon from "@/shared/assets/icons/accordion-arrow.svg";
import arrowBackIcon from "@/shared/assets/icons/arrow.svg";
import chatIcon from "@/shared/assets/icons/chat.svg";
import { getErrorText } from "@/shared/lib/getErrorText";
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
import { Offer, useLazyGetOfferByIdQuery } from "@/entities/Offer";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { useCreateApplicationFormMutation } from "@/entities/Application";
import { useGetChatMessages } from "@/entities/Chat/lib/useGetChatMessages";
import { useAuth } from "@/routes/model/guards/AuthProvider";
import { useGetProfileInfoQuery } from "@/entities/Profile";
import { formatDate, formatMessageDate } from "@/shared/lib/formatDate";
import { useLazyGetApplicationFormByIdQuery } from "@/entities/Application/api/applicationApi";
import { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";

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
    const [processedMessages, setProcessedMessages] = useState<JSX.Element[]>([]);
    const messegesEndRef = useRef<HTMLDivElement | null>(null);

    const { mercureToken } = useAuth();

    const [getOfferData, { isLoading: isOfferDataLoading }] = useLazyGetOfferByIdQuery();
    const { data: myProfileData } = useGetProfileInfoQuery();
    const {
        messages,
        isLoading: isMessagesLoading,
    } = useGetChatMessages(id, mercureToken, myProfileData?.id);
    const [createApplicationForm] = useCreateApplicationFormMutation();
    const [getApplicationData] = useLazyGetApplicationFormByIdQuery();

    useEffect(() => {
        if (isChatCreate && offerId) {
            const fetchOffer = async () => {
                const resultOfferData = await getOfferData(offerId).unwrap()
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
        const processMessages = async () => {
            let currentDate = "";
            const elements = await Promise.all(messages.map(async (message) => {
                const {
                    createdAt, author, text, applicationForm,
                } = message;
                const messageDate = new Date(createdAt).toDateString();

                const partsAuthor = author.split("/");
                const authorId = partsAuthor.pop();
                const isUser = myProfileData?.id !== authorId;

                let dateLine = null;
                if (messageDate !== currentDate) {
                    currentDate = messageDate;
                    dateLine = (
                        <div className={styles.date}>
                            {
                                formatDate(locale, currentDate)
                            }
                        </div>
                    );
                }

                if (applicationForm) {
                    const partsApplicationForm = applicationForm.split("/");
                    const applicationFormId = partsApplicationForm.pop();
                    try {
                        const applicationResult = await getApplicationData(applicationFormId ?? "").unwrap();
                        const { vacancy, startDate, endDate } = applicationResult;

                        return (
                            <OfferApplication
                                offerData={vacancy}
                                terms={{
                                    start: new Date(startDate),
                                    end: new Date(endDate),
                                }}
                                isHost
                                username="Николай Николаевич"
                                isClosed
                                onChange={() => {}}
                            />
                        );
                    } catch {
                        return null;
                    }
                }

                return (
                    <>
                        {dateLine}
                        <Message
                            avatar=""
                            date={formatMessageDate(locale, createdAt)}
                            isUser={isUser}
                            text={text}
                            username={authorId ?? ""}
                        />
                    </>
                );
            }));
            setProcessedMessages(elements.filter((el): el is JSX.Element => el !== null));
        };

        processMessages();
    }, [messages, getApplicationData, myProfileData, locale]);

    useEffect(() => {
        messegesEndRef.current?.scrollIntoView({
            behavior: "instant",
            block: "nearest",
        });
    }, [messages, processedMessages, id]);

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

    const onImageChange = (src: string) => {
        setSelectedImage(src);
    };

    const onClosePopup = () => {
        setSelectedImage(undefined);
    };

    const handleBackButton = () => {
        onBackButton(undefined);
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
                .then(() => {
                    setToast({
                        text: "Заявка успешно отправлена",
                        type: HintType.Success,
                    });
                    setApplicationClosed(true);
                    reset({ applicationForm: data.applicationForm });
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
            if (isOfferDataLoading) {
                return <MiniLoader className={styles.miniLoader} />;
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
                                username="Николай Николаевич"
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
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <div className={styles.topTab}>
                    <div className={styles.topInner}>
                        <ReactSVG
                            src={arrowBackIcon}
                            className={styles.back}
                            onClick={handleBackButton}
                        />
                        <span className={styles.userName}>Николай Николаевич</span>
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
                    <div className={styles.chatList}>
                        {isMessagesLoading || isOfferDataLoading ? <MiniLoader /> : (
                            <>
                                {renderChat()}
                                <div className={styles.messegesEnd} ref={messegesEndRef} />
                            </>
                        )}
                    </div>
                </div>
                <SendMessage disabled={isChatCreate} chatId={id} />
            </div>
            <UserInfoCard
                user={mockedChatUser}
                infoOpenedChange={infoOpenedChange}
                className={cn(styles.userInfo, { [styles.open]: isInfoOpened })}
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
