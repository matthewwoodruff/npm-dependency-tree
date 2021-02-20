import {buildThrottler} from "./promiseThrottler";

interface ControllablePromise<T> extends PromiseHandles<T> {
    promise: Promise<T>;
}

type PromiseHandles<T> = {
    resolve: (arg: T) => void;
    reject: (arg: unknown) => void;
};

export async function controllablePromise<T>(): Promise<
    ControllablePromise<T>
    > {
    let handlesResolver: (arg: PromiseHandles<T>) => void;
    const handlesPromise = new Promise<PromiseHandles<T>>(resolve => {
        handlesResolver = resolve;
    });
    const promise = new Promise<T>(
        (resolve, reject) => handlesResolver && handlesResolver({ resolve, reject })
    );

    const { resolve, reject } = await handlesPromise;

    return {
        promise,
        resolve,
        reject,
    };
}

describe('throttler', () => {

    it('should only allow one concurrent request', async () => {
        const {promise, resolve} = await controllablePromise<string>();
        const {promise: promise2, resolve: resolve2} = await controllablePromise<string>();
        const firstMockFunction = jest.fn().mockImplementation(() => promise2);
        const secondMockFunction = jest.fn().mockResolvedValue("third");

        const throttler = buildThrottler(1);

        const throttledPromise1 = throttler(() => promise)
        const throttledPromise2 = throttler(firstMockFunction);
        const throttledPromise3 = throttler(secondMockFunction);

        expect(firstMockFunction).not.toHaveBeenCalled();
        expect(secondMockFunction).not.toHaveBeenCalled();
        resolve("first")
        await expect(throttledPromise1).resolves.toEqual("first")

        expect(firstMockFunction).toHaveBeenCalled();
        expect(secondMockFunction).not.toHaveBeenCalled();
        resolve2("second")
        await expect(throttledPromise2).resolves.toEqual("second")

        expect(secondMockFunction).toHaveBeenCalled();
        await expect(throttledPromise3).resolves.toEqual("third");
    })


})