import { memo } from "react";

import styles from "./OfferWhatToDoForm.module.scss";
import { useLocale } from "@/app/providers/LocaleProvider";

interface OfferWhatToDoFormProps {
    onSuccess?: () => void;
}

export const OfferWhatToDoForm = memo(({ onSuccess }: OfferWhatToDoFormProps) => {
    const { locale } = useLocale();

    return (
        <form className={styles.wrapper}>
            Форма
        </form>
    );
});
