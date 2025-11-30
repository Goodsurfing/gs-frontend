import { FC, useEffect, useState } from "react";
import DOMPurify from "dompurify";

interface InlineSafeSvgProps extends React.HTMLAttributes<HTMLDivElement> {
    src: string; // путь к SVG
    className?: string; // css-классы
}

export const InlineSafeSvg: FC<InlineSafeSvgProps> = ({ src, className, ...rest }) => {
    const [svg, setSvg] = useState<string | null>(null);

    useEffect(() => {
        const loadSvg = async () => {
            try {
                const response = await fetch(src);
                const text = await response.text();

                const cleanSvg = DOMPurify.sanitize(text, {
                    USE_PROFILES: { svg: true },
                });

                setSvg(cleanSvg);
            } catch (e) {
                setSvg(null);
            }
        };

        loadSvg();
    }, [src]);

    return (
        <div
            className={className}
            dangerouslySetInnerHTML={svg ? { __html: svg } : undefined}
            {...rest}
        />
    );
};
