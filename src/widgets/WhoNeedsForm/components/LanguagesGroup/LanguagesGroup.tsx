import React, { useState } from "react";

import AddButton from "shared/ui/AddButton/AddButton";
import CloseButton from "shared/ui/CloseButton/CloseButton";
import Switch from "shared/ui/Switch/Switch";

import Languages from "../Languages/Languages";
import ExtraControls from "../ExtraControls/ExtraControls";

import styles from "./LanguagesGroup.module.scss";

const LanguagesGroup = () => {
  const [languagesCount, setLanguagesCount] = useState([0]);

  const onCloseBtnClick = (index: number) => {
    if (index === 0) return;
    setLanguagesCount(languagesCount.filter((_, i) => i !== index));
  };

  return (
      <div className={styles.wrapper}>
          <div className={styles.langsWrapper}>
              {languagesCount.map((_, index) => (
                  <Languages
                      key={index}
                      close={(
                          <CloseButton
                              sx={{
                                minWidth: "36px",
                                minHeight: "36px",
                                mb: "8px",
                              }}
                              className={styles.closeBtn}
                              onClick={() => onCloseBtnClick(index)}
                          />
                          )}
                  />
              ))}
              {languagesCount.length > 1 && (
              <ExtraControls />
              )}
          </div>
          <div className="">
              <AddButton
                  onClick={() => setLanguagesCount((prev) => [...prev, 0])}
              >
                  Добавить язык
              </AddButton>
          </div>
      </div>
  );
};

export default LanguagesGroup;
