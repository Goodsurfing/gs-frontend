import React, { FC, memo } from "react";

import Button from "@/shared/ui/Button/Button";
import banner from "@/shared/assets/images/member-banner/banner.png";

import styles from "./MemberBanner.module.scss";

export const MemberBanner: FC = memo(() => (
    <div className={styles.wrapper} style={{ backgroundImage: `url(${banner})` }}>
        <h3 className={styles.title}>
            Оформи членство Гудсёрфинга и открой для себя бескрайний мир
            путешествий со смыслом!
        </h3>
        <Button color="BLUE" size="SMALL" variant="FILL">
            Получить членство
        </Button>
    </div>
));
