import {buildCache} from "./cache";
import faker from "faker";

describe('cache', () => {

    it('should not use cache when there is no value in the cache', async () => {
        const name1 = faker.lorem.word();
        const version1 = faker.system.semver()
        const name2 = faker.lorem.word();
        const version2 = faker.system.semver()
        const mock = jest.fn()
            .mockReturnValueOnce({name: name1, version: version1, dependencies:[]})
            .mockReturnValueOnce({name: name2, version: version2, dependencies:[]})

        const cache = buildCache(mock);

        const packageRequest1 = {name: name1, version: {request: version1, raw: version1}};
        const npmPackageResponse1 = await cache(packageRequest1);
        const packageRequest2 = {name: name2, version: {request: version2, raw: version2}};
        const npmPackageResponse2 = await cache(packageRequest2);

        expect(mock).toHaveBeenCalledTimes(2);
        expect(npmPackageResponse1).toEqual({name: name1, version: version1, dependencies:[]})
        expect(npmPackageResponse2).toEqual({name: name2, version: version2, dependencies:[]})
    })

    it('should not use cache when the underlying value is undefined', () => {
        const name = faker.lorem.word();
        const version = faker.system.semver()
        const mock = jest.fn().mockReturnValue(undefined);

        const cache = buildCache(mock);

        const packageRequest = {name, version: {request: version, raw: version}}
        cache(packageRequest);
        cache(packageRequest);

        expect(mock).toHaveBeenCalledTimes(2)
    })

    it('should use cache when there is a value in the cache', () => {
        const name = faker.lorem.word();
        const version = faker.system.semver()
        const mock = jest.fn().mockReturnValue({name, version, dependencies:[]});

        const cache = buildCache(mock);

        const packageRequest = {name, version: {request: version, raw: version}}
        cache(packageRequest);
        cache(packageRequest);

        expect(mock).toHaveBeenCalledTimes(1)
    })

})