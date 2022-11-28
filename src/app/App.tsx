import React, { FC } from "react";
import { BrowserRouter } from "react-router-dom";

import Button from "@/components/ui/Button/Button";
import SectionTitle from "@/components/ui/SectionTitle/SectionTitle";

const App: FC = () => {
    return (
        <BrowserRouter>
            <SectionTitle>Работа</SectionTitle>
            <Button path={"/"} type={"primary"}>
                Посмотреть все
            </Button>
        </BrowserRouter>
    );
};

export default App;
