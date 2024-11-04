type Func<T, U> = (arg: T) => U;

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export const pipe = <T, U>(initial: T, ...functions: Func<any, any>[]): U => {
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    return functions.reduce((result: any, func: Func<any, any>) => func(result), initial) as U;
};
