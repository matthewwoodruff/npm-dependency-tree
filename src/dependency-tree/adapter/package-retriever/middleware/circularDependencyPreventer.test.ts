import faker from "faker";
import {buildCircularDependencyPreventer} from "./circularDependencyPreventer";

describe('circular dependency preventer', () => {

    it('should remove the dependencies from an already seen package', async () => {
        const name = faker.lorem.word();
        const version = faker.system.semver();

        const depName = faker.lorem.word();
        const depVersion = faker.system.semver();

        const npmPackage = {name, version, dependencies:[{name: depName, version: depVersion}]};
        const mock = jest.fn().mockReturnValue(npmPackage)

        const circularDependencyPreventer = buildCircularDependencyPreventer(mock);

        const packageRequest = {name, version: {request: version, raw: version}};

        const firstResponse = await circularDependencyPreventer(packageRequest);
        const secondResponse = await circularDependencyPreventer(packageRequest);

        expect(firstResponse).toEqual({
            ...npmPackage,
            canonical: true,
        })
        expect(secondResponse).toEqual({
            ...npmPackage,
            dependencies: []
        })
    })

})