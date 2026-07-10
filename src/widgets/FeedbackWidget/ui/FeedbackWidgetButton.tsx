import { memo } from "react";
import { useLocation } from "react-router-dom";
import { ReactSVG } from "react-svg";
import chatIcon from "@/shared/assets/icons/chat.svg";
import { useFeedbackWidget } from "@/app/providers/FeedbackWidgetProvider";
import styles from "./FeedbackWidgetButton.module.scss";

export const FeedbackWidgetButton = memo(() => {
    const { openFeedbackModal } = useFeedbackWidget();
    const { pathname } = useLocation();

    if (pathname.includes("/admin")) {
        return null;
    }

    return (
        <button
            type="button"
            className={styles.button}
            onClick={openFeedbackModal}
            title="Напишите нам"
        >
            <ReactSVG src={chatIcon} className={styles.icon} />
        </button>
    );
});
