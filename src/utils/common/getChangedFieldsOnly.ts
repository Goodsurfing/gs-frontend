const getPropertyValue = <Obj, Key extends keyof Obj>(
    obj: Obj,
    key: Key,
): Obj[Key] => {
    return obj[key];
};

export const getChangedFieldsOnly = <ObjectType extends {}>(
    baseObject: ObjectType,
    dirtyFields: any,
) => {
    const result: Partial<ObjectType> = {};

    Object.keys(baseObject).forEach((key) => {
        if (getPropertyValue(dirtyFields, key as keyof ObjectType)) {
            result[key as keyof ObjectType] = getPropertyValue(
                baseObject,
                key as keyof ObjectType,
            );
        }
    });

    return result;
};
