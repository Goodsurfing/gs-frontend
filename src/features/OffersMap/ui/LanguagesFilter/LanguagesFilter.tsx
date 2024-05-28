import React, {
    FC, useRef,
    useState,
} from "react";
import cn from "classnames";
import styles from "./LanguagesFilter.module.scss";
import Arrow from "@/shared/ui/Arrow/Arrow";
import Popup from "@/components/Popup/Popup";
import { BluePoint } from "@/widgets/OffersMap/ui/BluePoint/BluePoint";
import { LanguagesGroup } from "../LanguagesGroup/LanguagesGroup";
import { useOnClickOutside } from "@/shared/hooks/useOnClickOutside";

interface LanguagesFilterProps {
    className?: string;
    value: string[]
    onChange: (value: string[]) => void
}

export const LanguagesFilter: FC<LanguagesFilterProps> = (props) => {
    const {
        className, value, onChange,
    } = props;
    const languagesRef = useRef(null);
    const [isShowDropdown, setShowDropdown] = useState<boolean>(false);

    useOnClickOutside(languagesRef, () => {
        setShowDropdown(() => (false));
    });

    const handleClick = () => {
        setShowDropdown((prev) => (!prev));
    };

    return (
        <div className={cn(styles.wrapper, className)} ref={languagesRef}>
            <div
                onClick={() => handleClick()}
                className={cn(styles.btn, { [styles.open]: isShowDropdown })}
            >
                <div className={styles.inner}>
                    Знание языков
                    <BluePoint isShow={value.length > 0} className={styles.bluePoint} />
                </div>
                <Arrow
                    isOpen={isShowDropdown}
                    className={cn(
                        styles.arrow,
                        { [styles.open]: isShowDropdown },
                    )}
                />
            </div>
            <Popup
                className={styles.popup}
                isOpen={isShowDropdown}
            >
                <div className={styles.popupContainer}>
                    <LanguagesGroup value={value} onChange={onChange} />
                </div>
            </Popup>
        </div>
    );
};
