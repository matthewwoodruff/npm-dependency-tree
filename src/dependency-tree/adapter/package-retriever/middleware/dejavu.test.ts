import faker from "faker";
import {buildDejavu} from "./dejavu";

describe('dejavu', () => {

    it('should remove the dependencies from an already seen package', async () => {
        const name = faker.lorem.word();
        const version = faker.system.semver();

        const depName = faker.lorem.word();
        const depVersion = faker.system.semver();

        const npmPackage = {name, version, dependencies:[{name: depName, version: depVersion}]};
        const mock = jest.fn().mockReturnValue(npmPackage)

        const dejavu = buildDejavu(mock);

        const packageRequest = {name, version: {request: version, raw: version}};

        const firstResponse = await dejavu(packageRequest);
        const secondResponse = await dejavu(packageRequest);

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