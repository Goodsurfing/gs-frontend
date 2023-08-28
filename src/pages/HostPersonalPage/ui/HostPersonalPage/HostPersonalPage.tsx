import { useTranslation } from "react-i18next";

import { Submenu } from "@/widgets/Submenu";
import { SubmenuItems } from "../../model/data/submenuData";
import { Footer } from "@/widgets/Footer";
import { HostPersonalCard } from "../HostPersonalCard/HostPersonalCard";

import styles from "./HostPersonalPage.module.scss";

export const HostPersonalPage = () => {
    const { t } = useTranslation();
    return (
        <div className={styles.wrapper}>
            <HostPersonalCard />
            <Submenu className={styles.navMenu} items={SubmenuItems} />
            <Footer />
        </div>
    );
};
