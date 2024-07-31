import cn from "classnames";
import React, { FC, useState } from "react";
import { ReactSVG } from "react-svg";

import { Controller, DefaultValues, useForm } from "react-hook-form";
import { OfferApplication, UserSettings } from "@/features/Messenger";

import { MessageType, UserChatType, UserInfoCard } from "@/entities/Messenger";

import arrowIcon from "@/shared/assets/icons/accordion-arrow.svg";
import arrowBackIcon from "@/shared/assets/icons/arrow.svg";
import chatIcon from "@/shared/assets/icons/chat.svg";

import { Message } from "../Message/Message";
import { SendMessage } from "../SendMessage/SendMessage";
import { Modal } from "@/shared/ui/Modal/Modal";
import { useCreateApplicationFormMutation } from "@/entities/Chat/api/chatApi";
import { ChatFormFields } from "../../model/types/chatForm";
import styles from "./Chat.module.scss";
import { applicationOfferAdapter } from "../../lib/applicationOfferAdapter";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { ErrorType } from "@/types/api/error";
import { getErrorText } from "@/shared/lib/getErrorText";

interface ChatProps {
    id?: string;
    offerId?: string;
    onBackButton: (value?: string) => void
    className?: string;
    user: UserChatType;
    messages: MessageType[];
}

const defaultValues: DefaultValues<ChatFormFields> = {
    applicationForm: {
        endDate: undefined,
        startDate: undefined,
    },
};

export const Chat: FC<ChatProps> = (props) => {
    const {
        id,
        offerId,
        className,
        onBackButton,
        user,
    } = props;

    const { handleSubmit, control } = useForm<ChatFormFields>({ mode: "onChange", defaultValues });

    const isChatCreate = id === "create";
    const [isInfoOpened, setInfoOpened] = useState<boolean>(false);
    const [selectedImage, setSelectedImage] = useState<string | undefined>();
    const [toast, setToast] = useState<ToastAlert>();

    const [createApplicationForm] = useCreateApplicationFormMutation();

    if (!id) {
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

    const renderMessages = () => {
        let currentDate = "";

        return user.messages.map((message) => {
            const messageDate = new Date(message.date).toLocaleDateString();

            let dateLine = null;
            if (messageDate !== currentDate) {
                currentDate = messageDate;
                dateLine = <div className={styles.date}>{currentDate}</div>;
            }

            return (
                <>
                    {dateLine}
                    <Message
                        avatar={user.avatar}
                        date={message.date}
                        isUser={message.isUser}
                        text={message.content}
                        username={user.name}
                    />
                </>
            );
        });
    };

    const handleVolunteerSubmitOfferApplication = handleSubmit(async (data) => {
        const { applicationForm: { startDate, endDate } } = data;
        if ((startDate !== undefined) && (endDate !== undefined) && (offerId)) {
            setToast(undefined);
            const preparedData = applicationOfferAdapter(data, offerId);
            const result = createApplicationForm(preparedData).unwrap().then((dataApplication) => {
                setToast({
                    text: "Заявка успешно отправлена",
                    type: HintType.Success,
                });
                return dataApplication;
            }).catch((error: ErrorType) => {
                setToast({
                    text: getErrorText(error),
                    type: HintType.Error,
                });
            });
            if (result) {
                // eslint-disable-next-line no-console
                console.log(result);
            }
        }
    });

    const renderChat = () => {
        if (id === "create") {
            return (
                <Controller
                    name="applicationForm"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                        <OfferApplication
                            terms={{ start: value.startDate, end: value.endDate }}
                            onChange={({ start, end }) => onChange(
                                { ...value, startDate: start, endDate: end },
                            )}
                            isHost={false}
                            username="Николай Николаевич"
                            isClosed={false}
                            onSubmit={handleVolunteerSubmitOfferApplication}
                        />
                    )}
                />
            );
        }
        return (
            <>
                <Message
                    avatar=""
                    date={new Date()}
                    isUser
                    image="https://corporate.walmart.com/content/corporate/en_us/purpose/sustainability/planet/nature/jcr:content/par/image_2_0.img.png/1693432526985.png"
                    username={user.name}
                    onImageClick={onImageChange}
                />
                {renderMessages()}
            </>
        );
    };

    return (
        <div className={cn(styles.wrapper, className)}>
            {toast && <HintPopup text={toast.text} type={toast.type} timeout={6000} />}
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <div className={styles.topTab}>
                    <div className={styles.topInner}>
                        <ReactSVG
                            src={arrowBackIcon}
                            className={styles.back}
                            onClick={handleBackButton}
                        />
                        <span className={styles.userName}>{user.name}</span>
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
                        {renderChat()}
                    </div>
                </div>
                <SendMessage disabled={isChatCreate} />
            </div>
            <UserInfoCard
                user={user}
                infoOpenedChange={infoOpenedChange}
                className={cn(styles.userInfo, { [styles.open]: isInfoOpened })}
            />
            {selectedImage && (
                <Modal onClose={onClosePopup}>
                    <img src={selectedImage} className={styles.imagePopup} alt="" />
                </Modal>
            )}
        </div>
    );
};
