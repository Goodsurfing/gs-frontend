import React, { FC } from "react";
import cn from "classnames";
import { Filter, TagsOption } from "@/features/Article";
import Button from "@/shared/ui/Button/Button";

interface FilterProps {
    className?: string;
    value: TagsOption;
    onChange: (value: TagsOption) => void;
    onAddVideoClick: () => void;
}

export const VideoFilter: FC<FilterProps> = (props) => {
    const {
        className, value, onChange, onAddVideoClick,
    } = props;

    const onAddVideoClickHandler = () => {
        onAddVideoClick();
    };

    return (
        <div className={cn(className)}>
            <Filter value={value} onChange={onChange} />
            <Button
                color="GREEN"
                variant="FILL"
                size="SMALL"
                onClick={onAddVideoClickHandler}
            >
                Добавить видео
            </Button>
        </div>
    );
};
