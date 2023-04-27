import React from "react";

import Button from "@/UI/Button/Button";
import { Variant } from "@/UI/Button/Button.interface";

import InviteName from "../InviteName/InviteName";
import Categories from "../Categories/Categories";

export const InviteDescriptionForm = () => {
    const onSubmit = () => {};
    return (
        <form onSubmit={onSubmit}>
            <InviteName />
            <Categories />
            <Button rounded variant={Variant.PRIMARY}>Сохранить</Button>
        </form>
    );
};

