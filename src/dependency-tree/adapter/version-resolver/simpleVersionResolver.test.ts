import * as faker from "faker";
import {resolve} from "./simpleVersionResolver";

describe('simple version resolver', () => {

    it('should return min version for a specific version', () => {
        const version = faker.system.semver();
        const actualVersion = resolve(version);
        expect(actualVersion).toEqual({
            raw: version,
            request: version
        })
    })

    it('should return min version for a version specification', () => {
        const version = '^1.2.3';
        const actualVersion = resolve(version);
        expect(actualVersion).toEqual({
            raw: '^1.2.3',
            request: '1.2.3'
        })
    })

    it('should return raw string if the version is not a semver', () => {
        const version = 'latest';
        const actualVersion = resolve(version);
        expect(actualVersion).toEqual({
            raw: version,
            request: version
        })
    })
})