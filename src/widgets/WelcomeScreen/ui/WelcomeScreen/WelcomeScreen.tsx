import { memo } from "react";
import cn from "classNames";

interface WelcomeScreenProps {
    className?: string;
    hostId: string;
}

export const WelcomeScreen = memo((props: WelcomeScreenProps) => {
    const { className, hostId } = props;

    return (
        <div className={cn(className, styles.wrapper)} />
    );
});
