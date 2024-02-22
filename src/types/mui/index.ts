export type AsProp<C extends React.ElementType> = { as?: C };
export type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P);
// eslint-disable-next-line max-len
export type PolymorphicComponentProp<C extends React.ElementType, Props = {}> = React.PropsWithChildren<Props & AsProp<C>> & Omit<React.ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;
