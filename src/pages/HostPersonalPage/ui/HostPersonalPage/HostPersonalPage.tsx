import { useTranslation } from "react-i18next";

import styles from "./HostPersonalPage.module.scss";
import { Submenu } from "@/widgets/Submenu";
import { SubmenuItems } from "../../model/data/submenuData";
import { Footer } from "@/widgets/Footer";

export const HostPersonalPage = () => {
    const { t } = useTranslation();
    return (
        <div className={styles.wrapper}>
            
            <Submenu className={styles.navMenu} items={SubmenuItems} />
            <Footer />
        </div>
    );
};
 