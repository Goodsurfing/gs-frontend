import React, {
    FC,
} from "react";
import { MessageIcon } from "@/shared/ui/MessageIcon/MessageIcon";
import { useMessenger } from "@/app/providers/MessengerProvider";

export const MessangerInfo: FC = () => {
    const { unreadMessages } = useMessenger();

    return <MessageIcon count={unreadMessages} />;
};
