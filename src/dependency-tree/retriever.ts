import {
    DependencyTree,
    DependencyTreeRetriever,
    NpmPackageRequestCommand
} from "./retriever.types";
import {VersionResolver} from "./port/versionResolver.types";
import {PackageRetriever} from "./port/packageRetriever.types";

type PackageRetrieverBuilder = (pr: PackageRetriever) => PackageRetriever;

const buildPackageRetriever = (packageRetriever: PackageRetriever, sessionPackageRetriever?: PackageRetrieverBuilder): PackageRetriever =>
    sessionPackageRetriever ? sessionPackageRetriever(packageRetriever) : packageRetriever

export const buildDependencyTreeRetriever =
    (versionResolver: VersionResolver, packageRetriever: PackageRetriever, sessionPackageRetriever?: PackageRetrieverBuilder) =>
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

