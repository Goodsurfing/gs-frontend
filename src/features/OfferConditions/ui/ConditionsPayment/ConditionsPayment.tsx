import { memo } from "react";

import { MenuItem } from "@mui/material";
import Input from "@/shared/ui/Input/Input";

import { Payment } from "@/entities/Offer";
import { SelectComponent } from "@/shared/ui/Select/Select";

import { paymentValues } from "../../model/data/payment";

import styles from "./ConditionsPayment.module.scss";

interface ConditionsPaymentProps {
    value: Payment;
    onChange: (value: Payment) => void;
}

export const ConditionsPayment = memo((props: ConditionsPaymentProps) => {
    const { onChange, value } = props;

    const onContributionChange = (inputValue: string) => {
        if (!Number.isNaN(+inputValue)) {
            onChange({ ...value, contribution: +inputValue });
        }
    };

    const onRewardChange = (inputValue: string) => {
        if (!Number.isNaN(+inputValue)) {
            onChange({ ...value, reward: +inputValue });
        }
    };

    return (
        <div className={styles.wrapper}>
            <p className={styles.title}>Оплата</p>
            <div className={styles.content}>
                <div className={styles.volunteer}>
                    <Input description="Взносы волонтера" type="number" value={value.contribution} onChange={(e) => onContributionChange(e.target.value)} />
                </div>
                <div className={styles.reward}>
                    <Input description="Вознаграждение труда" type="number" value={value.reward} onChange={(e) => onRewardChange(e.target.value)} />
                </div>
                <SelectComponent className={styles.dropdown} defaultValue={value.currency}>
                    {paymentValues.map((currency) => (
                        <MenuItem
                            key={currency.symbol}
                            value={currency.name}
                        >
                            {currency.symbol}
                        </MenuItem>
                    ))}
                </SelectComponent>
            </div>
        </div>
    );
});
