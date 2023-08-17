import { memo } from "react";
import { HostDescriptionOrganization } from "../HostDescriptionOrganization/HostDescriptionOrganization";
import { HostDescriptionSocial } from "../HostDescriptionSocial/HostDescriptionSocial";

interface HostDescriptionFormContentProps {
    className?: string;
}

export const HostDescriptionFormContent = memo((props: HostDescriptionFormContentProps) => {
    const { className } = props;

    return (
        <div className={className}>
            <HostDescriptionOrganization />
            <HostDescriptionSocial />
        </div>
    );
});
