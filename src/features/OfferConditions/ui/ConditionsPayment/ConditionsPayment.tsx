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
        if (inputValue.length <= 15) {
            if (inputValue === "" || /^[0-9]+$/.test(inputValue)) {
                onChange({ ...value, contribution: inputValue ? +inputValue : 0 });
            }
        }
    };

    const onRewardChange = (inputValue: string) => {
        if (inputValue.length <= 15) {
            if (inputValue === "" || /^[0-9]+$/.test(inputValue)) {
                onChange({ ...value, reward: inputValue ? +inputValue : 0 });
            }
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
                    <Input description={t("conditions.Взносы волонтера")} type="number" value={value.contribution.toString()} onChange={(e) => onContributionChange(e.target.value)} min="0" />
                </div>
                <div className={styles.reward}>
                    <Input description={t("conditions.Вознаграждение труда")} type="number" value={value.reward.toString()} onChange={(e) => onRewardChange(e.target.value)} min="0" />
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
