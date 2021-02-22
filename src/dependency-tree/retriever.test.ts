import * as faker from "faker";
import {NpmPackage} from "./retriever.types";
import {buildDependencyTreeRetriever} from "./retriever";
import {buildPackageRetriever} from "./adapter/package-retriever/inMemoryPackageRetriever";

const testResolver = (version: string) => ({raw: version, request: version})

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

        const dependencyTree = await buildDependencyTreeRetriever(testResolver, packageRetriever)({name, version});
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

        const dependencyTree = await buildDependencyTreeRetriever(testResolver, packageRetriever)({name, version});
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

})