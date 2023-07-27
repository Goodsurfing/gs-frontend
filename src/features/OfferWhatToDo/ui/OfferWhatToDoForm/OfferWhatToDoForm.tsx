import { memo, useState } from "react";

import styles from "./OfferWhatToDoForm.module.scss";
import { useLocale } from "@/app/providers/LocaleProvider";
import IconButtonComponent from "@/shared/ui/IconButtonComponent/IconButtonComponent";

import { skillsData } from "@/shared/data/skills";

interface OfferWhatToDoFormProps {
    onSuccess?: () => void;
}

export const OfferWhatToDoForm = memo(({ onSuccess }: OfferWhatToDoFormProps) => {
    const { locale } = useLocale();

    const [checked, setChecked] = useState(false);

    const onIconClick = () => { setChecked(!checked) };

    return (
        <form className={styles.wrapper}>
            {skillsData.map((item, i) => (
                <IconButtonComponent
                    key={i}
                    className={styles.icon}
                    text={item.text}
                    size="large"
                    onClick={onIconClick}
                    checked={checked}
                    icon={item.icon}
                />
            ))}
        </form>
    );
});
