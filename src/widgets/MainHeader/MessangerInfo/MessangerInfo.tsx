import React, {
    FC, useCallback, useEffect, useState,
} from "react";
import { useLazyGetUnreadMessagesQuery } from "@/entities/Profile/api/profileApi";
import { MessageIcon } from "@/shared/ui/MessageIcon/MessageIcon";
import { useMessenger } from "@/app/providers/MessengerProvider";
import { Profile } from "@/entities/Profile";
import { BASE_URL } from "@/shared/constants/api";
import { useAuth } from "@/routes/model/guards/AuthProvider";

interface MessangerInfoProps {
    myProfile: Profile;
}

export const MessangerInfo: FC<MessangerInfoProps> = (props) => {
    const { myProfile } = props;
    const { mercureToken } = useAuth();

    const [getUnreadMessages] = useLazyGetUnreadMessagesQuery();
    const [unreadMessages, setUnreadMessages] = useState<number>(0);

    const { registerMessageUpdateCallback } = useMessenger();

    const fetchMessages = useCallback(() => {
        getUnreadMessages().then((res) => {
            if (res?.data?.unreadMessagesCount !== undefined) {
                setUnreadMessages(res.data.unreadMessagesCount);
            }
        });
    }, [getUnreadMessages]);

    useEffect(() => {
        fetchMessages();
        registerMessageUpdateCallback(async () => {
            fetchMessages();
        });
    }, [fetchMessages, registerMessageUpdateCallback]);

    useEffect(() => {
        if (!mercureToken) return;

        const url = new URL(`${BASE_URL}.well-known/mercure`);
        url.searchParams.append(
            "topic",
            `${BASE_URL}api/v1/users/${myProfile.id}/messages/{?chat}`,
        );
        url.searchParams.append("authorization", mercureToken);

        const eventSource = new EventSource(url);

        eventSource.addEventListener("messageOnChat", () => {
            setUnreadMessages((prev) => prev + 1);
        });

        return () => {
            eventSource.close();
        };
    }, [mercureToken, myProfile.id]);

    return (
        <MessageIcon count={unreadMessages} />
    );
};
