import cn from "classnames";
import React, { FC, useEffect, useRef, useState } from "react";

import { useOnClickOutside } from "@/hooks/useOnClickOutside";

import { GeoObjectHintType } from "../Ymaps/types/ymaps";
import styles from "./Hints.module.scss";

interface Hints {
    hints: GeoObjectHintType[];
    setAddress: (value: string) => void;
}

const Hints: FC<Hints> = ({ hints, setAddress }) => {
    const [opened, setOpened] = useState<boolean>(false);
    const hintsRef = useRef(null);

    useEffect(() => {
        setOpened(true);
    }, [hints]);

    const handleClickOutside = () => {
        setOpened(false);
    };

    useOnClickOutside(hintsRef, handleClickOutside);

    return (
        <div
            ref={hintsRef}
            className={cn(styles.wrapper, {
                [styles.opened]: opened,
            })}
        >
            <ul className={styles.hints}>
                {hints.map((item, index) => (
                    <li
                        onClick={() => {
                            setAddress(
                                `${item.GeoObject.description}, ${item.GeoObject.name}`
                            );
                            setOpened(false);
                        }}
                        key={index}
                        className={styles.hint}
                    >
                        <span className={styles.city}>
                            {item.GeoObject.name}
                        </span>
                        ,
                        <span className={styles.address}>
                            {item.GeoObject.description}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default React.memo(Hints);
