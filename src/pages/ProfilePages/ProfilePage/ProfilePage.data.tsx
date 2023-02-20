import calendarIcon from "@assets/icons/navbar/calendar.svg";
import globeIcon from "@assets/icons/navbar/globe.svg";
import homeIcon from "@assets/icons/navbar/home.svg";
import mailIcon from "@assets/icons/navbar/mail.svg";
import cityIcon from "@assets/icons/navbar/city.svg";

import { SideMenuContent } from "@/components/SideMenu/types/SideMenu.interface";
import { SidebarLinkProps } from "@/components/Sidebar/SidebarNavigation/SidebarLink/SidebarLink";

export const SidebarNavigationLinksData: SidebarLinkProps[] = [
    {
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                fill="none"
                viewBox="0 0 40 40"
            >
                <g
                    stroke="#fff"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.667"
                    clipPath="url(#clip0_1567_0)"
                >
                    <path d="M20 18.333a5 5 0 100-10 5 5 0 000 10zM30 30c0-5.523-4.477-10-10-10s-10 4.477-10 10M30 3.333h6.667V10M10 3.333H3.333V10M30 36.667h6.667V30M10 36.667H3.333V30" />
                </g>
                <defs>
                    <clipPath id="clip0_1567_0">
                        <path fill="#fff" d="M0 0H40V40H0z" />
                    </clipPath>
                </defs>
            </svg>
        ),
        to: "profile/info",
        text: "Обо мне",
    },
    {
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                fill="none"
                viewBox="0 0 40 40"
            >
                <g
                    stroke="#8494A1"
                    strokeLinejoin="round"
                    strokeWidth="1.667"
                    clipPath="url(#clip0_1567_8)"
                >
                    <path d="M20 36.667c4.602 0 8.769-1.866 11.785-4.882A16.614 16.614 0 0036.667 20c0-4.602-1.866-8.77-4.882-11.785A16.614 16.614 0 0020 3.333 16.615 16.615 0 008.215 8.215 16.615 16.615 0 003.333 20c0 4.602 1.866 8.769 4.882 11.785A16.615 16.615 0 0020 36.667z" />
                    <path strokeLinecap="round" d="M13.333 20l5 5 10-10" />
                </g>
                <defs>
                    <clipPath id="clip0_1567_8">
                        <path fill="#fff" d="M0 0H40V40H0z" />
                    </clipPath>
                </defs>
            </svg>
        ),
        to: "profile/preferences",
        text: "Предпочтения",
    },
    {
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                fill="none"
                viewBox="0 0 40 40"
            >
                <g
                    stroke="#8494A1"
                    strokeLinejoin="round"
                    strokeWidth="1.667"
                    clipPath="url(#clip0_1567_12)"
                >
                    <path d="M33.333 18.333H6.667C5.747 18.333 5 19.08 5 20v15c0 .92.746 1.667 1.667 1.667h26.666c.92 0 1.667-.747 1.667-1.667V20c0-.92-.746-1.667-1.667-1.667z" />
                    <path
                        strokeLinecap="round"
                        d="M11.667 18.333v-6.666a8.333 8.333 0 0116.666 0v6.666M20 25v5"
                    />
                </g>
                <defs>
                    <clipPath id="clip0_1567_12">
                        <path fill="#fff" d="M0 0H40V40H0z" />
                    </clipPath>
                </defs>
            </svg>
        ),
        to: "profile/reset-password",
        text: "Пароль",
    },
    {
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                fill="none"
                viewBox="0 0 40 40"
            >
                <g
                    stroke="#8494A1"
                    strokeLinejoin="round"
                    strokeWidth="1.633"
                    clipPath="url(#clip0_1567_17)"
                >
                    <path d="M5.306 7.556l14.701-4.29 14.687 4.29v8.798a21.483 21.483 0 01-14.692 20.381A21.486 21.486 0 015.306 16.35V7.556z" />
                    <path
                        strokeLinecap="round"
                        d="M12.653 18.776l5.714 5.714 9.796-9.796"
                    />
                </g>
                <defs>
                    <clipPath id="clip0_1567_17">
                        <path fill="#fff" d="M0 0H40V40H0z" />
                    </clipPath>
                </defs>
            </svg>
        ),
        to: "profile/private",
        text: "Приватность",
    },
];

export const SideMenuData: SideMenuContent = [
    {
        text: "Рабочий стол",
        icon: homeIcon,
        route: '/'
    },
    {
        text: "Предложения",
        icon: globeIcon,
        route: '/'
    },
    {
        text: "Заявки",
        icon: mailIcon,
        route: '/'
    },
    {
        text: "Календарь",
        icon: calendarIcon,
        route: '/'
        
    },
    {
        text: "Организация",
        icon: cityIcon,
        dropdownItems: [
            {
                text: "Описание",
                route: "/",
            },
            {
                text: "Фотогалерея",
                route: "/",
            },
            {
                text: "Видеогалерея",
                route: "/",
            },
            {
                text: "Команда",
                route: "/",
            },
            {
                text: "Отзывы",
                route: "/",
            },
        ],
    },
];
