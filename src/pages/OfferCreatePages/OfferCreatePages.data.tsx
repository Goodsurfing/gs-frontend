import backIcon from '@assets/icons/navbar/offers/back.svg';
import calendarIcon from '@assets/icons/navbar/offers/calendar.svg';
import checklistIcon from '@assets/icons/navbar/offers/checklist.svg';
import pinIcon from '@assets/icons/navbar/offers/pin.svg';
import rightUserIcon from '@assets/icons/navbar/offers/right-user.svg';
import viewListIcon from '@assets/icons/navbar/offers/view-list.svg';
import writeIcon from '@assets/icons/navbar/offers/writing-fluently.svg';
import listCheckboxIcon from '@assets/icons/navbar/offers/list-checkbox.svg';

import { SideMenuParams } from 'components/SideMenu/types/SideMenu.interface';

export const SideMenuData: SideMenuParams[] = [
  {
    text: 'К предложениям',
    icon: backIcon,
    route: '/offers',
  },
  {
    text: 'Где',
    icon: pinIcon,
    route: '/where',
  },
  {
    text: 'Когда',
    icon: calendarIcon,
    route: '/when',
  },
  {
    text: 'Кто нужен',
    icon: rightUserIcon,
    route: '/who',
  },
  {
    text: 'Описание',
    icon: checklistIcon,
    route: '/description',
  },
  {
    text: 'Что делать',
    icon: viewListIcon,
    route: '/what-to-do',
  },
  {
    route: '/rules',
    text: 'Условия',
    icon: listCheckboxIcon,
  },
  {
    route: '/last',
    text: 'Последние штрихи',
    icon: writeIcon,
  },
];
