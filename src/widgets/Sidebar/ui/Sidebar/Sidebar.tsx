import cn from "classnames";
import { memo, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import { useParams, NavLink } from "react-router-dom";
import { SidebarContentProps } from "../../model/types/sidebar";
import { SidebarArrow } from "../SidebarArrow/SidebarArrow";
import { useSidebarContext } from "../SidebarContext/SidebarContext";
import { SidebarLinks } from "../SidebarLinks/SidebarLinks";
import styles from "./Sidebar.module.scss";
import { useLocale } from "@/app/providers/LocaleProvider";
import { isSidebarLinkBack } from "../../lib/isSidebarLinkBack";

export interface SidebarProps {
    content: SidebarContentProps[];
}

export const Sidebar = memo(({ content }: SidebarProps) => {
    const { isOpen } = useSidebarContext();
    const { locale } = useLocale();
    const { id } = useParams();
    const pathCheck = useMemo(() => (route: string) => {
        if (id) {
            if (isSidebarLinkBack(route)) {
                return `/${locale}${route}`;
            } return `/${locale}${route}/${id}`;
        }
        return `/${locale}${route}`;
    }, [id, locale]);

    const sidebarContent = useMemo(
        () => content.map((item, index) => (
            <SwiperSlide key={index}>
                <NavLink
                    to={pathCheck(item.route)}
                    replace
                    className={({ isActive }) => cn(
                        styles.link,
                        {
                            [styles.isActive]: isActive,
                        },
                    )}
                >
                    <div className={styles.mobileSidebarLink}>
                        {item.text}
                    </div>
                </NavLink>
            </SwiperSlide>
        )),
        [content, pathCheck],
    );

    return (
        <>
            <nav className={cn(styles.sidebar, { [styles.open]: isOpen })}>
                <SidebarLinks content={content} />
                <SidebarArrow />
            </nav>
            <nav className={cn(styles.mobileSidebar)}>
                <Swiper
                    style={{ paddingLeft: "20px", paddingRight: "60px" }}
                    spaceBetween={15}
                    slidesPerView={4}
                    breakpoints={{
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
                    }}
                >
                    {sidebarContent}
                </Swiper>
            </nav>
        </>
    );
});
