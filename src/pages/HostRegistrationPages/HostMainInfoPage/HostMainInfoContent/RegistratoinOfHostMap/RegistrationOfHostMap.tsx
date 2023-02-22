import React, { FC, useState } from "react";

import YMapWithAddress from "@/components/Ymaps/YMapWithAddress";
import { YMapType } from "@/components/Ymaps/types/ymaps";
import Input, { InputType } from "@/components/ui/Input/Input";

import styles from './RegistrationOfHostMap.module.scss';

interface IRegistrationOfHostYmaps {}

const RegistrationOfHostMap: FC<IRegistrationOfHostYmaps> = () => {
    const [ymap, setYmap] = useState<YMapType>(null);
    const [inputValue, setInputValue] = useState('');
    return (
        <>
            <Input className={styles.input} value={inputValue} setInputValue={setInputValue} label='Адрес' type={InputType.TEXT}  />
            <YMapWithAddress
                width={`100%`}
                height={`170px`}
                ymap={ymap}
                setYmap={setYmap}
            />
        </>

    );
};

export default RegistrationOfHostMap;
