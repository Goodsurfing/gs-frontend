import React, { FC } from "react";
import { BrowserRouter } from "react-router-dom";

import Button from "@/components/ui/Button/Button";

const App: FC = () => {
    return (
        <BrowserRouter>
            <Button path={"/"} type={"primary"}>
                Посмотреть все
            </Button>
        </BrowserRouter>
    );
};

export default App;
