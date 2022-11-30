import React, { FC } from "react";

import EmptyHeader from "@/components/ui/EmptyHeader/EmptyHeader";

import styles from "./SignUpPage.module.scss";

const SignUpPage: FC = () => {
    return (
        <main className={styles.main}>
            <EmptyHeader />
        </main>
    );
};

export default SignUpPage;
