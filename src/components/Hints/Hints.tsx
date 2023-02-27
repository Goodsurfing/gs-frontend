import cn from "classnames";
import React, { FC, useEffect, useRef, useState } from "react";

import { useOnClickOutside } from "@/hooks/useOnClickOutside";

import { GeoObjectHintType } from "../Ymaps/types/ymaps";
import styles from "./Hints.module.scss";

interface Hints {
    hints: GeoObjectHintType[];
    setAddress: (value: string) => void;
    setAddressByHint: (value: boolean) => void;
    selectedAddressByHint: boolean;
}

const Hints: FC<Hints> = ({ hints, setAddress, setAddressByHint, selectedAddressByHint }) => {
    const [opened, setOpened] = useState<boolean>(false);
    const hintsRef = useRef(null);

    useEffect(() => {
        if (!selectedAddressByHint) {
            setOpened(true);
        }
    }, [hints, selectedAddressByHint]);

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
                            setAddressByHint(true);
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

export default Hints;
