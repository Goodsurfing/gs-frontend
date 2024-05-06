import cn from "classnames";
import React, {
    FC, useMemo, useRef, useState,
} from "react";

import { mockedUsers } from "@/entities/Messenger/model/data/mockedUsers";
import { UserCard } from "@/entities/Messenger/ui/UserCard/UserCard";

import styles from "./MessengerList.module.scss";

interface MessengerListProps {
    className?: string;
}

export const MessengerList: FC<MessengerListProps> = (props) => {
    const { className } = props;

    const [width, setWidth] = useState("980px");
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    const handleMouseMove = (e: MouseEvent) => {
        if (wrapperRef.current) {
            const newWidth = e.clientX - wrapperRef.current.getBoundingClientRect().left;
            setWidth(`${newWidth}px`);
        }
    };

    const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const renderUserCard = useMemo(
        () => mockedUsers.map(
            (user) => (
                <UserCard
                    data={user}
                    key={user.id}
                />
            ),
        ),
        [],
    );

    return (
        <div
            className={cn(styles.layout, className)}
            style={{ width }}
            ref={wrapperRef}
        >
            <div
                className={cn(styles.wrapper)}

            >
                {renderUserCard}
            </div>
            <div
                className={styles.rightBorder}
                onMouseDown={handleMouseDown}
            />
        </div>
    );
};
