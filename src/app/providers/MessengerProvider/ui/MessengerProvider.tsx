import {
    createContext,
    useContext,
    useCallback,
    useRef,
    useMemo,
    useState,
    useEffect,
    ReactNode,
    FC,
} from "react";
import { useGetProfileInfoQuery, useLazyGetUnreadMessagesQuery } from "@/entities/Profile/api/profileApi";
import { useAuth } from "@/routes/model/guards/AuthProvider";
import { BASE_URL } from "@/shared/constants/api";
import { MessageType } from "@/entities/Messenger";
import { useAppSelector } from "@/shared/hooks/redux";
import { getUserAuthData } from "@/entities/User";

interface MessengerContextType {
    unreadMessages: number;
    onReadMessage: () => void;
    registerMessageUpdateCallback: (callback: () => void) => () => void;
    registerOnMessageCallback: (callback: (msg: MessageType) => void) => () => void;
}

const MessengerContext = createContext<MessengerContextType | undefined>(undefined);

export const useMessenger = () => {
    const context = useContext(MessengerContext);
    if (!context) {
        throw new Error("useMessenger должен использоваться внутри MessengerProvider");
    }
    return context;
};

interface MessengerProviderProps {
    children: ReactNode;
}

export const MessengerProvider: FC<MessengerProviderProps> = ({ children }) => {
    const [unreadMessages, setUnreadMessages] = useState<number>(0);
    const updateCallbacksRef = useRef<Set<() => void>>(new Set());
    const onMessageCallbacksRef = useRef<Set<(msg: MessageType) => void>>(new Set());
    const isAuth = useAppSelector(getUserAuthData);

    const { mercureToken } = useAuth();
    const { data: myProfile } = useGetProfileInfoQuery();
    const [getUnreadMessages] = useLazyGetUnreadMessagesQuery();

    const fetchMessages = useCallback(() => {
        getUnreadMessages().then((res) => {
            if (res?.data?.unreadMessagesCount !== undefined) {
                setUnreadMessages(res.data.unreadMessagesCount);
            }
        });
    }, [getUnreadMessages]);

    const registerMessageUpdateCallback = useCallback((callback: () => void) => {
        updateCallbacksRef.current.add(callback);
        return () => updateCallbacksRef.current.delete(callback);
    }, []);

    const registerOnMessageCallback = useCallback((callback: (msg: MessageType) => void) => {
        onMessageCallbacksRef.current.add(callback);
        return () => onMessageCallbacksRef.current.delete(callback);
    }, []);

    const onReadMessage = useCallback(() => {
        updateCallbacksRef.current.forEach((cb) => cb());
    }, []);

    useEffect(() => {
        if (!isAuth) return;
        fetchMessages();
        registerMessageUpdateCallback(() => {
            fetchMessages();
        });
    }, [fetchMessages, registerMessageUpdateCallback, isAuth]);

    useEffect(() => {
        if (!mercureToken || !myProfile?.id || !isAuth) return;

        const url = new URL(`${BASE_URL}.well-known/mercure`);
        url.searchParams.append("topic", `${BASE_URL}api/v1/users/${myProfile.id}/messages/{?chat}`);
        url.searchParams.append("authorization", mercureToken);

        const eventSource = new EventSource(url);

        eventSource.addEventListener("messageOnChat", (event) => {
            const updatedMessage: MessageType = JSON.parse(event.data);

            setUnreadMessages((prev) => prev + 1);
            onMessageCallbacksRef.current.forEach((cb) => cb(updatedMessage));
        });

        return () => {
            eventSource.close();
        };
    }, [mercureToken, myProfile?.id, isAuth]);

    const contextValue = useMemo(() => ({
        unreadMessages,
        onReadMessage,
        registerMessageUpdateCallback,
        registerOnMessageCallback,
    }), [unreadMessages, onReadMessage,
        registerMessageUpdateCallback, registerOnMessageCallback]);

    return (
        <MessengerContext.Provider value={contextValue}>
            {children}
        </MessengerContext.Provider>
    );
};
