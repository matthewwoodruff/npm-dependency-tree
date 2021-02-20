import * as faker from "faker";
import {buildPackageRetriever} from "./adapter/package-retriever/inMemoryNpmPackageRetriver";
import {NpmPackage} from "./retriever.types";
import {buildDependencyTreeRetriever} from "./retriever";

describe('retriever', () => {

    it('should handle zero dependencies', async () => {
        const version = faker.system.semver();
        const name = faker.lorem.word();

        const packageRetriever = buildPackageRetriever([{
            name,
            version,
            ok: true,
            dependencies: [],
        }])

        const dependencyTree = await buildDependencyTreeRetriever(packageRetriever)({name, version});
        expect(dependencyTree).toEqual({
            name,
            version,
            dependencies: [],
            ok: true,
        })
    });

    it('should handle one dependency one level deep', async () => {
        const dependencyName = faker.lorem.word();
        const dependencyVersion = faker.system.semver()
        const dependency: NpmPackage = {
            name: dependencyName,
            version: dependencyVersion,
            ok: true,
            dependencies: [],
        }

        const version = faker.system.semver();
        const name = faker.lorem.word();
        const npmPackage: NpmPackage = {
            name,
            version,
            ok: true,
            dependencies: [dependency],
        };

        const packageRetriever = buildPackageRetriever([npmPackage, dependency])

        const dependencyTree = await buildDependencyTreeRetriever(packageRetriever)({name, version});
        expect(dependencyTree).toEqual({
            name,
            version,
            ok: true,
            dependencies: [{
                name: dependencyName,
                version: dependencyVersion,
                ok: true,
                dependencies: []
            }]
        })
    })

    it('should rewrite version to min version', async () => {

        const name = faker.lorem.word();
        const npmPackage: NpmPackage = {
            name,
            version: '1.2.1',
            ok: true,
            dependencies: [],
        };

        const packageRetriever = buildPackageRetriever([npmPackage])

        const dependencyTree = await buildDependencyTreeRetriever(packageRetriever)({name, version: '^1.2.1'});
        expect(dependencyTree.version).toEqual('1.2.1')
    })

    it('allows latest as valid version', async () => {

        const name = faker.lorem.word();
        const npmPackage = {
            name,
            version: '1.2.3',
            dependencies: [],
        };

        const packageRetriever = jest.fn().mockReturnValueOnce(npmPackage);

        const dependencyTree = await buildDependencyTreeRetriever(packageRetriever)({name, version: 'latest'});
        expect(dependencyTree?.version).toEqual('1.2.3')
    })

})