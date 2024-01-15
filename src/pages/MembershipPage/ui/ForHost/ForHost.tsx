import cn from "classnames";
import React, { FC } from "react";

import checkIcon from "@/shared/assets/icons/select-check.svg";
import Button from "@/shared/ui/Button/Button";

import styles from "./ForHost.module.scss";

interface ForHostProps {
    className?: string;
}

export const ForHost: FC<ForHostProps> = (props: ForHostProps) => {
    const { className } = props;
    return (
        <section className={cn(className, styles.wrapper)}>
            <h2 className={styles.title}>Для организатора</h2>
            <div className={styles.table}>
                <div className={styles.column}>
                    <div className={styles.columnHeader}>
                        <h2 className={styles.columnTitle}>Без членства</h2>
                        <span className={styles.price}>
                            0
                            {" "}
                            <span className={styles.smallPrice}>руб/год</span>
                        </span>
                    </div>
                    <div className={styles.columnContent}>
                        <div className={styles.row}>
                            <span>
                                Количество бесплатных объявлений на платформе
                                «Гудсёрфинг»
                            </span>
                            <span className={styles.blueText}>
                                1 объявление в год
                            </span>
                        </div>
                        <div className={styles.row}>
                            <span>
                                Участие в онлайн-мероприятиях «Гудсёрфинг»
                            </span>
                            <img
                                src={checkIcon}
                                alt=""
                                className={styles.icon}
                            />
                        </div>
                        <div className={styles.row}>
                            <span>Доступ к Академии «Гудсёрфинг»</span>
                            <img
                                src={checkIcon}
                                alt=""
                                className={styles.icon}
                            />
                        </div>
                        <div className={styles.row}>
                            <span>Доступ к блогу «Гудсёрфинг»</span>
                            <img
                                src={checkIcon}
                                alt=""
                                className={styles.icon}
                            />
                        </div>
                    </div>
                    <div className={styles.columnFooter}>
                        <Button color="BLUE" size="SMALL" variant="FILL">
                            Зарегестрироваться
                        </Button>
                    </div>
                </div>
                <div className={styles.column}>
                    <div className={styles.columnHeader}>
                        <h2 className={styles.columnTitle}>Членство</h2>
                        <span className={styles.price}>
                            1 500
                            {" "}
                            <span className={styles.smallPrice}>руб/год</span>
                        </span>
                    </div>
                    <div className={styles.columnContent}>
                        <div className={styles.row}>
                            <span>
                                Количество бесплатных объявлений на платформе
                                «Гудсёрфинг»
                            </span>
                            <span className={styles.blueText}>
                                не ограничено
                            </span>
                        </div>
                        <div className={styles.row}>
                            <span>
                                Доступ к уникальным чатам платформы «Гудсёрфинг»
                            </span>
                            <img
                                src={checkIcon}
                                alt=""
                                className={styles.icon}
                            />
                        </div>
                        <div className={styles.row}>
                            <span>Доступ к Академии «Гудсёрфинг»</span>
                            <img
                                src={checkIcon}
                                alt=""
                                className={styles.icon}
                            />
                        </div>
                        <div className={styles.row}>
                            <span>
                                Получение статуса амбассадора (при выполнении
                                условий)
                            </span>
                            <img
                                src={checkIcon}
                                alt=""
                                className={styles.icon}
                            />
                        </div>
                        <div className={styles.row}>
                            <span>
                                Участие в онлайн-мероприятиях «Гудсёрфинг»
                            </span>
                            <img
                                src={checkIcon}
                                alt=""
                                className={styles.icon}
                            />
                        </div>
                        <div className={styles.row}>
                            <span>
                                Участие в офлайн-мероприятиях «Гудсёрфинг»
                            </span>
                            <img
                                src={checkIcon}
                                alt=""
                                className={styles.icon}
                            />
                        </div>
                        <div className={styles.row}>
                            <span>
                                Повышенное доверие волонтёров при выборе проекта
                                для участия (специальная метка в профиле)
                            </span>
                            <img
                                src={checkIcon}
                                alt=""
                                className={styles.icon}
                            />
                        </div>
                        <div className={styles.row}>
                            <span>Доступ к блогу «Гудсёрфинг»</span>
                            <img
                                src={checkIcon}
                                alt=""
                                className={styles.icon}
                            />
                        </div>
                        <div className={styles.row}>
                            <span>
                                Скидка для размещения рекламы и объявлений по
                                платным тарифам на платформе «Гудсёрфинг»
                            </span>
                            <img
                                src={checkIcon}
                                alt=""
                                className={styles.icon}
                            />
                        </div>
                    </div>
                    <div className={styles.columnFooter}>
                        <Button color="GREEN" size="SMALL" variant="FILL">
                            Получить членство
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};
