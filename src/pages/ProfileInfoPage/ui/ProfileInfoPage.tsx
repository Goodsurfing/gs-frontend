import React, { FC, useState } from "react";

import ProfileInfoForm from "../ProfileInfoForm/ProfileInfoForm";

import styles from "./ProfileInfoPage.module.scss";

const ProfileInfoPage: FC = () => {
  const [isLocked, setIsLocked] = useState<boolean>(true);

  return (
      <main className={styles.wrapper}>
          <div className={styles.titleWrapper}>
              <h2 className={styles.title}>Основная информация</h2>
              <p
                  onClick={() => setIsLocked(!isLocked)}
                  className={styles.link}
              >
                  {isLocked ? "Редактировать профиль" : "Посмотреть профиль"}
              </p>
          </div>
          <div className={styles.form}>
              <ProfileInfoForm isLocked={isLocked} />
          </div>
      </main>
  );
};

export default ProfileInfoPage;
