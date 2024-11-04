type Func<T, U> = (arg: T) => U;
export declare const pipe: <T, U>(initial: T, ...functions: Func<any, any>[]) => U;
export {};
