import { ILanguage } from 'types/languages';

import ruIcon from 'shared/assets/icons/langs/ru.svg';
import spIcon from 'shared/assets/icons/langs/spain.svg';
import engIcon from 'shared/assets/icons/langs/uk.svg';

export const changeLanguageData: ILanguage[] = [
  {
    id: '1',
    code: 'ru',
    name: 'Русский',
    icon: ruIcon,
  },
  {
    id: '2',
    code: 'en',
    name: 'English',
    icon: engIcon,
  },
  {
    id: '3',
    code: 'es',
    name: 'Español',
    icon: spIcon,
  },
];
