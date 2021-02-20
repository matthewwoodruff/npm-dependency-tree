import {NpmRegistryClient} from "./npmRegistryClient";

import { setupServer } from 'msw/node'
import { rest } from 'msw'
import faker from "faker";

export const server = setupServer()

beforeAll(() => {
    server.listen()
})

afterEach(() => {
    server.resetHandlers()
})

afterAll(() => {
    server.close()
})

describe('npm client', () => {

    describe('get npm package', () => {

        it('should request package information from npm', async () => {
            const version = faker.system.semver();
            const name = faker.lorem.word();

            const dependencyVersion = faker.system.semver();
            const dependencyName = faker.lorem.word();

            const npmResponse = {
                name: name,
                version: version,
                dependencies: {
                    [dependencyName]: dependencyVersion
                }
            }

            const endpoint = 'http://localhost';
            server.use(
                rest.get(`${endpoint}/${name}/${version}`, async (req, res, ctx) => {
                    return res(ctx.status(200), ctx.json(npmResponse))
                }),
            )

            const npmPackageResponse = await NpmRegistryClient(endpoint)
                .getNpmPackage({name, version: {request: version, raw: version}});

            expect(npmPackageResponse).toEqual({
                name: name,
                version: version,
                dependencies: [{
                    name: dependencyName,
                    version: dependencyVersion,
                }],
                ok: true
            })
        })

        it('should allow package to have no dependencies', async () => {
            const version = faker.system.semver();
            const name = faker.lorem.word();

            const npmResponse = {
                name: name,
                version: version
            }

            const endpoint = 'http://localhost';
            server.use(
                rest.get(`${endpoint}/${name}/${version}`, async (req, res, ctx) => {
                    return res(ctx.status(200), ctx.json(npmResponse))
                }),
            )

            const npmPackageResponse = await NpmRegistryClient(endpoint)
                .getNpmPackage({name, version: {request: version, raw: version}});

            expect(npmPackageResponse).toEqual({
                name: name,
                version: version,
                ok: true,
                dependencies: []
            })
        })

        it('should return status failed if there was a server error', async () => {
            const version = faker.system.semver();
            const name = faker.lorem.word();

            const endpoint = 'http://localhost';
            server.use(
                rest.get(`${endpoint}/${name}/${version}`, async (req, res, ctx) => {
                    return res(ctx.status(500))
                }),
            )

            const npmPackageResponse = await NpmRegistryClient(endpoint)
                .getNpmPackage({name, version: {request: version, raw: version}});

            expect(npmPackageResponse).toEqual({
                name: name,
                version: version,
                ok: false,
                dependencies: []
            })
        })

        it('should return status failed if there was a client error', async () => {
            const version = faker.system.semver();
            const name = faker.lorem.word();

            const endpoint = 'http://localhost';
            server.use(
                rest.get(`${endpoint}/${name}/${version}`, async (req, res, ctx) => {
                    return res(ctx.status(400))
                }),
            )

            const npmPackageResponse = await NpmRegistryClient(endpoint)
                .getNpmPackage({name, version: {request: version, raw: version}});

            expect(npmPackageResponse).toEqual({
                name: name,
                version: version,
                ok: false,
                dependencies: []
            })
        })

    })

})