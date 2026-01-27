import React, { FC } from "react";

interface AdminOfferDescriptionProps {
    offerId: string;
}

export const AdminOfferDescription: FC<AdminOfferDescriptionProps> = (props) => {
    const { offerId } = props;
    return (
        <div>AdminOfferDescription</div>
    );
};
