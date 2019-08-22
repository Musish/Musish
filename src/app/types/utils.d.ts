type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

type Subtract<T extends K, K> = Omit<T, keyof K>;
