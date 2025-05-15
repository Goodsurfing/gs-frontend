import React, { useEffect, useState } from "react";
import { useLazyGetUnreadMessagesQuery } from "@/entities/Profile/api/profileApi";
import { MessageIcon } from "@/shared/ui/MessageIcon/MessageIcon";

export const MessangerInfo = () => {
    const [getUnreadMessages] = useLazyGetUnreadMessagesQuery();
    const [unreadMessages, setUnreadMessages] = useState<number>(0);

    useEffect(() => {
        const fetchMessages = () => {
            getUnreadMessages().then((res) => {
                if (res?.data?.unreadMessagesCount !== undefined) {
                    setUnreadMessages(res.data.unreadMessagesCount);
                }
            });
        };

        fetchMessages();

        const interval = setInterval(fetchMessages, 6000);

        return () => clearInterval(interval);
    }, [getUnreadMessages]);

    return (
        <MessageIcon count={unreadMessages} />
    );
};
