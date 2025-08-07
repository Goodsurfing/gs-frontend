import React, { useRef } from "react";

export const AuthByVk = () => {
    const oneTapRef = useRef(null);

    return (
        <div ref={oneTapRef} />
    );
};
