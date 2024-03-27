import { memo } from "react";

import { MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";
import Input from "@/shared/ui/Input/Input";

import { Currency, Payment } from "@/entities/Offer";
import { SelectComponent } from "@/shared/ui/Select/Select";

import { paymentValues } from "../../model/data/payment";

import styles from "./ConditionsPayment.module.scss";

interface ConditionsPaymentProps {
    value: Payment;
    onChange: (value: Payment) => void;
}

export const ConditionsPayment = memo((props: ConditionsPaymentProps) => {
    const { onChange, value } = props;
    const { t } = useTranslation("offer");

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

    const onCurrencyChange = (inputValue: Currency) => {
        onChange({ ...value, currency: inputValue });
    };

    return (
        <div className={styles.wrapper}>
            <p className={styles.title}>{t("conditions.Оплата")}</p>
            <div className={styles.content}>
                <div className={styles.volunteer}>
                    <Input description={t("conditions.Взносы волонтера")} type="number" value={value.contribution} onChange={(e) => onContributionChange(e.target.value)} />
                </div>
                <div className={styles.reward}>
                    <Input description={t("conditions.Вознаграждение труда")} type="number" value={value.reward} onChange={(e) => onRewardChange(e.target.value)} />
                </div>
                <SelectComponent className={styles.dropdown} defaultValue={value.currency}>
                    {paymentValues.map((currency) => (
                        <MenuItem
                            key={currency.symbol}
                            value={currency.name}
                            onClick={() => onCurrencyChange(currency.name)}
                        >
                            {currency.symbol}
                        </MenuItem>
                    ))}
                </SelectComponent>
            </div>
        </div>
    );
});
