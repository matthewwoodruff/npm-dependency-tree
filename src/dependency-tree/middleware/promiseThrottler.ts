export const buildThrottler = (maxConcurrency: number) => {
    let queue: ((value: void) => void)[] = [];
    let concurrency = 0;

    function triggerNext() {
        if (concurrency < maxConcurrency) {
            const promiseResolver = queue.shift();
            if (promiseResolver) {
                concurrency += 1;
                promiseResolver()
            }
        }
    }

    function throttler<T>(promiseGenerator: () => Promise<T>): Promise<T> {

        const promise = new Promise<void>(resolve => {
            queue.push(resolve);
        })
            .then(promiseGenerator)
            .finally(() => {
                concurrency -= 1;
                triggerNext();
            });

        setTimeout(triggerNext, 0)

        return promise;
    }

    return throttler
}


