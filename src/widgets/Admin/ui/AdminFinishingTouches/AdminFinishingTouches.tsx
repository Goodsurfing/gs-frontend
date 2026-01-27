import React, { FC } from "react";

interface AdminFinishingTouchesProps {
    offerId: string;
    className?: string;
}

export const AdminFinishingTouches: FC<AdminFinishingTouchesProps> = (props) => {
    const { offerId, className } = props;
    return (
        <div>AdminFinishingTouches</div>
    );
};
