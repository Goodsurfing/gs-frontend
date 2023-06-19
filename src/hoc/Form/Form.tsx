import React, { Component, PropsWithChildren, ReactNode } from 'react';
import { useForm } from 'react-hook-form';

interface IForm {
    defaultValues?: any;
    onSubmit: any;
    children: any;
}

export function Form({ defaultValues, onSubmit, children }: IForm) {
  const { handleSubmit, register } = useForm({ defaultValues });
  return (
      <form onSubmit={handleSubmit(onSubmit)}>
          {Array.isArray(children)
            ? children.map((child) => (child?.props?.id
              ? React.createElement(child.type, {
                ...{
                  ...child?.props,
                  register,
                  key: child?.props?.id,
                },
              })
              : child))
            : children}
      </form>
  );
}
