import {SideMenuParams} from '@/components/SideMenu/types/SideMenu.interface';

import houseIcon from '@/assets/icons/navbar/home.svg';
import globeIcon from '@/assets/icons/navbar/globe.svg';
import mailIcon from '@/assets/icons/navbar/mail.svg';
import calendarIcon from '@/assets/icons/navbar/calendar.svg';
import cityIcon from '@/assets/icons/navbar/city.svg';

export const HostRegistrationSidebarData: SideMenuParams[] = [
    {
        route: '/',
        text: 'Рабочий стол',
        icon: houseIcon
    },
    {
        route: '/',
        text: 'Предлложения',
        icon: globeIcon
    },
    {
        route: '/',
        text: 'Заявки',
        icon: mailIcon
    },
    {
        route: '/',
        text: 'Календарь',
        icon: calendarIcon
    },
    {
        route: '/',
        text: 'Организация',
        icon: cityIcon,
        dropdownItems: [
            {
                text: 'Описание',
                route: ''
            },
            {
                text: 'Фотогалерея',
                route: ''
            },
            {
                text: 'Видеогалерея',
                route: ''
            },
            {
                text: 'Команда',
                route: ''
            },
            {
                text: 'Отзывы',
                route: ''
            },

        ]
    },
]
