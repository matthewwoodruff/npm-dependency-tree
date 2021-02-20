import {PackageRetriever} from "./port/packageRetriever";
import semver from "semver/preload";
import {
    DependencyTree,
    DependencyTreeRetriever,
    NpmPackageRequestCommand, Version
} from "./retriever.types";

type PackageRetrieverBuilder = (pr: PackageRetriever) => PackageRetriever;

const buildPackageRetriever = (packageRetriever: PackageRetriever, sessionPackageRetriever?: PackageRetrieverBuilder): PackageRetriever =>
    sessionPackageRetriever ? sessionPackageRetriever(packageRetriever) : packageRetriever

export const buildDependencyTreeRetriever =
    (packageRetriever: PackageRetriever, sessionPackageRetriever?: PackageRetrieverBuilder): DependencyTreeRetriever =>
        (npmPackageRequest: NpmPackageRequestCommand) =>
            getDependencyTree(npmPackageRequest, buildPackageRetriever(packageRetriever, sessionPackageRetriever));

const parseVersion = (rawVersion: string): Version => {
    const raw = rawVersion;
    try {
        return {
            request: semver.minVersion(rawVersion)?.raw || rawVersion,
            raw
        };
    } catch (e) {
        return { request: raw, raw }
    }
}

const getDependencyTree = async ({name, version}: NpmPackageRequestCommand, packageRetriever: PackageRetriever): Promise<DependencyTree> => {

    const parsedVersion = parseVersion(version)

    const npmPackage = await packageRetriever({name, version: parsedVersion});

    const promises = npmPackage.dependencies
        .map(dependency => getDependencyTree(dependency, packageRetriever));

    return {
        ...npmPackage,
        dependencies: await Promise.all(promises)
    }
}

