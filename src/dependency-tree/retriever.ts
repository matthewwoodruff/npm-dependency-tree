import {PackageRetriever} from "./port/packageRetriever";
import semver from "semver/preload";
import {
    DependencyTree,
    DependencyTreeRetriever,
    NpmPackageRequestCommand, Version
} from "./retriever.types";
import {VersionResolver} from "./port/versionResolver.types";

type PackageRetrieverBuilder = (pr: PackageRetriever) => PackageRetriever;

const buildPackageRetriever = (packageRetriever: PackageRetriever, sessionPackageRetriever?: PackageRetrieverBuilder): PackageRetriever =>
    sessionPackageRetriever ? sessionPackageRetriever(packageRetriever) : packageRetriever

export const buildDependencyTreeRetriever =
    (versionResolver: VersionResolver, packageRetriever: PackageRetriever, sessionPackageRetriever?: PackageRetrieverBuilder): DependencyTreeRetriever =>
        (npmPackageRequest: NpmPackageRequestCommand) =>
            getDependencyTree(npmPackageRequest, versionResolver, buildPackageRetriever(packageRetriever, sessionPackageRetriever));

const getDependencyTree = async (
    {name, version}: NpmPackageRequestCommand,
    versionResolver: VersionResolver,
    packageRetriever: PackageRetriever): Promise<DependencyTree> => {

    const parsedVersion = versionResolver(version)

    const npmPackage = await packageRetriever({name, version: parsedVersion});

    const promises = npmPackage.dependencies
        .map(dependency => getDependencyTree(dependency, versionResolver, packageRetriever));

    return {
        ...npmPackage,
        dependencies: await Promise.all(promises)
    }
}

