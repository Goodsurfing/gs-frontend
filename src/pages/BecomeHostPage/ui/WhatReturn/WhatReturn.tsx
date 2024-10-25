import React from "react";
import cn from "classnames";
import styles from "./WhatReturn.module.scss";
import whatReturn1 from "@/shared/assets/images/become-host/whatReturn1.png";
import whatReturn2 from "@/shared/assets/images/become-host/whatReturn2.png";
import whatReturn3 from "@/shared/assets/images/become-host/whatReturn3.png";

export const WhatReturn = () => (
    <div className={styles.wrapper}>
        <div className={styles.top}>
            <h2>Что вы предлагаете взамен</h2>
            <p>
                Нужно понимать, что работа с гудсёрферами,
                как и с волонтёрами – это взаимный процесс.
                Чем больше вы сможете предложить,
                тем более вероятно вы сможете привлечь талантливых и трудолюбивых гудсёрферов.
            </p>
        </div>
        <div className={styles.mid}>
            <div className={cn(styles.mark, styles.left)}>
                <div className={styles.circle}>
                    <span>25 часов</span>
                </div>
                <span>помощи в неделю в среднем запрашивают наши хосты</span>
            </div>
            <div className={styles.mark}>
                <div className={styles.circle}>
                    <span>
                        На 2-4
                        <br />
                        недели
                    </span>
                </div>
                <span>в среднем приглашают гудсёрферов</span>
            </div>
        </div>
        <div className={styles.bottom}>
            <p>Основой является предложение питания, проживания и культурный обмен</p>
            <div className={styles.content}>
                <div className={styles.item}>
                    <img src={whatReturn1} alt="whatReturn1" />
                    <p>Проживание</p>
                    <ul>
                        <li>Отдельный дом</li>
                        <li>Комната</li>
                        <li>Койко-место</li>
                        <li>Палатка</li>
                        <li>Место под палатку</li>
                    </ul>
                </div>
                <div className={styles.item}>
                    <img src={whatReturn2} alt="whatReturn2" />
                    <p>Питание</p>
                    <ul>
                        <li>Полный пансион</li>
                        <li>Завтрак включен</li>
                        <li>Продукты</li>
                        <li>Вегетарианское</li>
                    </ul>
                </div>
                <div className={styles.item}>
                    <img src={whatReturn3} alt="whatReturn3" />
                    <p>Культурный обмен</p>
                    <span>
                        Взаимодействие и взаимное развитие
                        между волонтерами и принимающей стороной
                    </span>
                </div>
            </div>
        </div>
    </div>
);
