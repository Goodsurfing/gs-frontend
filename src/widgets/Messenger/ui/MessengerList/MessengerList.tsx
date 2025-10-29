import cn from "classnames";
import React, {
    FC, useEffect, useMemo, useState,
} from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useAuth } from "@/routes/model/guards/AuthProvider";

import { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";

import { useGetChatListData } from "@/entities/Chat";
import { ChatsList, UserCard } from "@/entities/Messenger";

import { ListFilter } from "../ListFilter/ListFilter";
import { useMessenger } from "@/app/providers/MessengerProvider";
import styles from "./MessengerList.module.scss";

interface MessengerListProps {
    className?: string;
    onUserClick?: (value: string) => void;
    locale: Locale;
}

export const MessengerList: FC<MessengerListProps> = (props: MessengerListProps) => {
    const {
        className, onUserClick, locale,
    } = props;
    const { token, mercureToken } = useAuth();

    const {
        chatsList,
        searchValue,
        statusValue,
        onChangeSearchValue,
        onChangeStatusValue,
        fetchChats,
    } = useGetChatListData(token, mercureToken);
    const { registerMessageUpdateCallback, registerOnMessageCallback } = useMessenger();

    const [visibleCount, setVisibleCount] = useState(20);
    const [filteredChatList, setFilteredChatList] = useState<ChatsList[]>([]);

    useEffect(() => {
        registerMessageUpdateCallback(() => {
            fetchChats();
        });
    }, [fetchChats, registerMessageUpdateCallback]);

    useEffect(() => {
        registerOnMessageCallback(() => {
            fetchChats();
        });
    }, [fetchChats, registerOnMessageCallback]);

    const handleTextChange = (text: string) => {
        onChangeSearchValue(text);
    };

    useEffect(() => {
        setFilteredChatList([]);
    }, [statusValue]);

    useEffect(() => {
        setFilteredChatList([...chatsList]);
    }, [chatsList]);

    const loadMore = () => {
        setVisibleCount((prev) => prev + 20);
    };

    const displayedChats = useMemo(
        () => filteredChatList.slice(0, visibleCount),
        [filteredChatList, visibleCount],
    );

    const renderUserCard = useMemo(
        () => displayedChats.map((chatItem) => (
            <div
                onClick={() => onUserClick?.(chatItem.id.toString())}
                key={chatItem.id.toString()}
            >
                <UserCard
                    dataChat={chatItem}
                    locale={locale}
                />
            </div>
        )),
        [displayedChats, locale, onUserClick],
    );

    return (
        <div className={cn(styles.layout, className)}>
            <div className={styles.topList}>
                <ListFilter
                    value={searchValue}
                    valueStatus={statusValue}
                    onChange={handleTextChange}
                    onChangeStatus={onChangeStatusValue}
                />
            </div>
            <div className={styles.wrapper} id="chat-scroll-wrapper">
                <InfiniteScroll
                    dataLength={displayedChats.length}
                    next={loadMore}
                    hasMore={displayedChats.length < filteredChatList.length}
                    scrollThreshold="70%"
                    loader={null}
                    scrollableTarget="chat-scroll-wrapper"
                >
                    {renderUserCard}
                </InfiniteScroll>
            </div>
        </div>
    );
};
