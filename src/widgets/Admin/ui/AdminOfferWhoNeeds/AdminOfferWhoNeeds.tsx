import React, { FC } from "react";

interface AdminOfferWhoNeedsProps {
    offerId: string;
}

export const AdminOfferWhoNeeds: FC<AdminOfferWhoNeedsProps> = (props) => {
    const { offerId } = props;
    return (
        <div>AdminOfferWhoNeeds</div>
    );
};
