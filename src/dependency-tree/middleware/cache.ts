
type CacheFunction<T, R> = (arg0: T) => R
export function buildCache<T, R>(cacheFunction: CacheFunction<T, R>): CacheFunction<T, R> {
    const cache: Record<string,R> = {};
    return (requestObject: T): R => {
        const key = JSON.stringify(requestObject);

        const cachedValue = cache[key];
        if (cachedValue) return cachedValue;

        const valueToCache = cacheFunction(requestObject);
        cache[key] = valueToCache;

        return valueToCache;
    }
}