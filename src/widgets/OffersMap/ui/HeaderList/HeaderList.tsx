import React, { FC, useState } from "react";

import styles from "./HeaderList.module.scss";
import { SwitchClosedOffers } from "../SwitchClosedOffers/SwitchClosedOffers";
import { SelectSort } from "../SelectSort/SelectSort";
import { ButtonClose } from "../ButtonClose/ButtonClose";

interface HeaderListProps {
    isShowMap: boolean;
    onChangeShowMap: (value: boolean) => void
}

export const HeaderList: FC<HeaderListProps> = (props) => {
    const { isShowMap, onChangeShowMap } = props;
    const [showClosedOffers, setShowClosedOffers] = useState<boolean>(false);

    return (
        <div className={styles.wrapper}>
            <span className={styles.offerCount}>2 059 вариантов</span>
            <SwitchClosedOffers value={showClosedOffers} onChange={setShowClosedOffers} />
            <SelectSort />
            <ButtonClose value={isShowMap} onChange={onChangeShowMap} />
        </div>
    );
};
