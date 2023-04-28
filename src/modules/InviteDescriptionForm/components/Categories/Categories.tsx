import React from "react";

import { ToggleButtonComponent } from "@/UI/ToggleButton/ToggleButtonComponent";

import ToggleButtonGroupComponent from "@/components/ToggleButtonGroup/ToggleButtonGroup";

import { tags } from "./Categories.data";

import styles from "./Categories.module.scss";

const Categories = () => {
    return (
        <div className={styles.wrapper}>
            <p className={styles.title}>Категория приглашения</p>
            <div className={styles.container}>
                <ToggleButtonGroupComponent
                    sx={{ display: "flex", gap: "30px" }}
                >
                    {tags.map((item, index) => (
                        <ToggleButtonComponent
                            sx={{
                                mt: "14px",
                                padding: "10px 15px",
                                border: item.color,
                                borderRadius: '26px', 
                                borderWidth: '2px',
                                borderStyle: 'solid',
                                textTransform: 'none',
                                color: '#212121',
                                fontSize: '14px',
                                fontFamily: 'Lato',
                                
                                '&:hover': {
                                  cursor: 'pointer',
                                  border: item.color,
                                  borderRadius: '26px', 
                                  borderWidth: '2px',
                                  borderStyle: 'solid',
                                  outline: 'none',
                                },

                                '&:selected:hover': {
                                  backgrounColor: 'none',
                                },

                                '&:selected': {
                                  cursor: 'pointer',
                                  border: item.color,
                                  borderRadius: '26px', 
                                  borderWidth: '2px',
                                  borderStyle: 'solid',
                                  outline: 'none',
                                }
                            }}
                            btncolor={item.color}
                            key={index}
                            value={item.value}
                        >
                            {item.text}
                        </ToggleButtonComponent>
                    ))}
                </ToggleButtonGroupComponent>
            </div>
        </div>
    );
};

export default Categories;
