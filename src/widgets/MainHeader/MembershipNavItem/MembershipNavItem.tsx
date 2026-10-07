import { FC, useState } from "react";
import { useTranslation } from "react-i18next";

import { useLocale } from "@/app/providers/LocaleProvider";
import { getMembershipPageUrl } from "@/shared/config/routes/AppUrls";
import { ProfileMembershipBanner } from "@/features/ProfileMembershipBanner";
import LocaleLink from "@/shared/ui/LocaleLink/LocaleLink";
import Popup from "@/shared/ui/Popup/Popup";

import styles from "./MembershipNavItem.module.scss";

/**
 * GS-149: при наведении курсора на пункт меню «Членство» в десктопной
 * шапке — мини-окно с тем же баннером, что и на /profile/info (GS-170).
 * Обычный клик по самому пункту меню по-прежнему ведёт на /membership —
 * Popup чисто визуальный, не перехватывает клик по LocaleLink.
 */
export const MembershipNavItem: FC = () => {
    const { t } = useTranslation();
    const { locale } = useLocale();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className={styles.wrapper}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <LocaleLink
                to={getMembershipPageUrl(locale)}
                className={styles.membershipCta}
            >
                {t("main.welcome.header.membership", "Членство")}
            </LocaleLink>
            <Popup isOpen={isOpen} className={styles.popup}>
                <ProfileMembershipBanner />
            </Popup>
        </div>
    );
};
