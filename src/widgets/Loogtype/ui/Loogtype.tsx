import cn from "classnames";
import { memo } from "react";
import { Link } from "react-router-dom";

import { useLocale } from "@/app/providers/LocaleProvider";

import logo from "@/shared/assets/icons/logo.svg";
import { getMainPageUrl } from "@/shared/config/routes/AppUrls";

import styles from "./Loogtype.module.scss";

interface LogotypeProps {
    className?: string;
}

export const Logotype = memo((props: LogotypeProps) => {
    const { className } = props;
    const { locale } = useLocale();
    return (
        <Link
            className={cn(className, styles.logo)}
            to={getMainPageUrl(locale)}
        >
            <img src={logo} alt="goodsurfing logo" />
        </Link>
    );
});
