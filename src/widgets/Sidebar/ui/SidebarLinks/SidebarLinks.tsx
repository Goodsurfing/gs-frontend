import { memo, useMemo } from "react";

import cn from "classnames";
import styles from "./SidebarLinks.module.scss";
import { SidebarContentProps } from "../../model/types/sidebar";
import { SidebarLink } from "../SidebarLink/SidebarLink";
import { SidebarDropdown } from "../SidebarDropdown/SidebarDropdown";

interface SidebarLinksProps {
    content: SidebarContentProps[];
}

export const SidebarLinks = memo(({ content }: SidebarLinksProps) => {
    const linksList = useMemo(() => content.map((item) => {
        if (item.dropdownItems) {
            return (
                <SidebarDropdown
                    text={item.text}
                    icon={item.icon}
                    route={item.route}
                    dropdownItems={item.dropdownItems}
                    key={item.text}
                />
            );
        }
        return (
            <SidebarLink
                text={item.text}
                icon={item.icon}
                key={item.text}
                route={item.route}
            />
        );
    }), [content]);

    return (
        <ul className={cn(styles.sidebarLinks)}>
            {linksList}
        </ul>
    );
});
