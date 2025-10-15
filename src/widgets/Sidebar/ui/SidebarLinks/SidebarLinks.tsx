import { memo, useMemo } from "react";

import cn from "classnames";
import { SidebarContentProps } from "../../model/types/sidebar";
import { SidebarLink } from "../SidebarLink/SidebarLink";
import { SidebarDropdown } from "../SidebarDropdown/SidebarDropdown";
import styles from "./SidebarLinks.module.scss";

interface SidebarLinksProps {
    content: SidebarContentProps[];
    classNameSidebarLinks?: string;
    classNameDropdownContainer?: string;
    classNameDropdownItem?: string;
}

export const SidebarLinks = memo(({
    content, classNameDropdownContainer,
    classNameDropdownItem,
    classNameSidebarLinks,
}: SidebarLinksProps) => {
    const linksList = useMemo(() => content.map((item) => {
        if (item.dropdownItems) {
            return (
                <SidebarDropdown
                    text={item.text}
                    icon={item.icon}
                    route={item.route}
                    dropdownItems={item.dropdownItems}
                    key={item.text}
                    classNameDropdownContainer={classNameDropdownContainer}
                    classNameDropdownItem={classNameDropdownItem}
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
    }), [classNameDropdownContainer, classNameDropdownItem, content]);

    return (
        <ul className={cn(styles.sidebarLinks, classNameSidebarLinks)}>
            {linksList}
        </ul>
    );
});
