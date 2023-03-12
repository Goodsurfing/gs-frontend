import cn from "classnames";
import React, { FC, useEffect, useState } from "react";
import { CSSTransition } from "react-transition-group";

import { IHintPopup } from "./HintPopup.interface";
import styles from "./HintPopup.module.scss";

const HintPopup: FC<IHintPopup> = ({
    text,
    className,
    type,
    inProp,
    timeout = 3000,
}) => {
    const [isActive, setActive] = useState(false);

    useEffect(() => {
        setActive(true);
        const timer = setTimeout(() => setActive(false), timeout);
        return () => {
            clearTimeout(timer);
        };
    }, []);

    return (
        <div className={cn(styles.wrapper, className)}>
            <CSSTransition
                in={isActive}
                timeout={timeout}
                classNames={{
                    enterActive: styles.enterActive,
                    exitDone: styles.exitDone,
                    exit: styles.exitDone,
                }}
            >
                <div
                    className={cn(styles.popup, {
                        [styles.error]: type === "error",
                        [styles.success]: type === "success",
                    })}
                >
                    {text}
                </div>
            </CSSTransition>
        </div>
    );
};

export default HintPopup;
