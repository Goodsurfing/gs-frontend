import { FC } from "react";
import defaultAvatarImage from "@/shared/assets/images/default-avatar.jpg";
import { userCardInfo } from "./model/types/reviewAboutVolunteers";
import Button from "@/shared/ui/Button/Button";

import styles from "./ReviewMiniCard.module.scss";

interface ReviewMiniCardProps {
    data:userCardInfo
}

export const ReviewMiniCard: FC<ReviewMiniCardProps> = ({
    data,
}: ReviewMiniCardProps) => {
    const {
        avatar, name, surname, country, city,
    } = data;

    return (
        <div className={styles.wrapper}>
            <div className={styles.userInfoContainer}>
                <img className={styles.avatar} src={defaultAvatarImage} alt="AVATAR" />
                <div className={styles.nameAddress}>
                    <span className={styles.name}>
                        {name}
                        {" "}
                        {surname}
                    </span>
                    <span className={styles.address}>
                        {country}
                        ,
                        {" "}
                        {city}
                    </span>
                </div>
            </div>
            <Button color="BLUE" variant="FILL" size="SMALL" className={styles.btn}>Добавить отзыв</Button>
        </div>
    );
};
