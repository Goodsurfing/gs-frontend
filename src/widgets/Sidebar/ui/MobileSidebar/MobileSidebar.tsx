import cn from "classnames";
import React, { FC, useMemo } from "react";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";

import { useLocale } from "@/app/providers/LocaleProvider";

import {
    isHostActiveCheck,
    isSidebarLinkBack,
} from "../../lib/isSidebarLinkBack";
import { SidebarContentProps } from "../../model/types/sidebar";
import { getHostInfoUrl } from "@/shared/config/routes/AppUrls";
import styles from "./MobileSidebar.module.scss";

interface MobileSidebarProps {
    className?: string;
    content: SidebarContentProps[];
}

export const MobileSidebar: FC<MobileSidebarProps> = (props) => {
    const { className, content } = props;
    const { locale } = useLocale();
    const { id } = useParams();
    const location = useLocation();
    const breakpoints = {
        992: {
            slidesPerView: 4,
            slidesOffsetBefore: 20,
            slidesOffsetAfter: 20,
        },
        662: {
            slidesPerView: 4,
            slidesOffsetBefore: 20,
            slidesOffsetAfter: 20,
        },
        480: {
            slidesPerView: 2,
            slidesOffsetBefore: 20,
            slidesOffsetAfter: 20,
        },
        0: {
            slidesPerView: 1,
            slidesOffsetBefore: 0,
            slidesOffsetAfter: 0,
        },
    };

    const pathCheck = useMemo(
        () => (route: string) => {
            if (id) {
                if (isSidebarLinkBack(route)) {
                    return `/${locale}${route}`;
                }
                return `/${locale}${route}/${id}`;
            }
            if (route === "/host") return getHostInfoUrl(locale);
            return `/${locale}${route}`;
        },
        [id, locale],
    );

    const isAnyItemActive = useMemo(
        () => content.some((item) => isHostActiveCheck(item, false, location)),
        [content, location],
    );

    const sidebarContent = useMemo(
        () => content.map((item, index) => (
            <SwiperSlide key={index}>
                <NavLink
                    to={pathCheck(item.route)}
                    replace
                    className={({ isActive }) => cn(styles.link, {
                        [styles.isActive]: isHostActiveCheck(
                            item,
                            isActive,
                            location,
                        ),
                    })}
                >
                    <div className={styles.mobileSidebarLink}>
                        {item.text}
                    </div>
                </NavLink>
            </SwiperSlide>
        )),
        [content, location, pathCheck],
    );

    const dropdownSidebarContent = useMemo(
        () => content
            .filter((item) => item.dropdownItems)
            .flatMap((item) => item.dropdownItems!.map((dropdownItem, index) => (
                <SwiperSlide key={`${item.route}-${index}`}>
                    <NavLink
                        to={pathCheck(`/host${dropdownItem.route}`)}
                        replace
                        className={() => cn(styles.link, {
                            [styles.isActive]: location.pathname.includes(dropdownItem.route),
                        })}
                    >
                        <div className={styles.mobileSidebarLink}>
                            {dropdownItem.text}
                        </div>
                    </NavLink>
                </SwiperSlide>
            ))),
        [content, location, pathCheck],
    );

    return (
        <nav className={cn(className, styles.mobileSidebar)}>
            <div>
                <Swiper
                    style={{ paddingLeft: "20px", paddingRight: "60px" }}
                    spaceBetween={15}
                    slidesPerView={4}
                    breakpoints={breakpoints}
                >
                    {sidebarContent}
                </Swiper>
            </div>
            {isAnyItemActive
            && (
                <div>
                    <Swiper
                        style={{ paddingLeft: "20px", paddingRight: "60px" }}
                        spaceBetween={15}
                        slidesPerView={4}
                        breakpoints={breakpoints}
                    >
                        {dropdownSidebarContent}
                    </Swiper>
                </div>
            )}
        </nav>
    );
};
