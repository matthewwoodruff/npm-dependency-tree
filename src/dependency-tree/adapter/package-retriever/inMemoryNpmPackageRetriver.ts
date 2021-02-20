import {NpmPackage, NpmPackageRequest} from "../../retriever.types";
import {PackageRetriever} from "../../port/packageRetriever.types";

export const buildPackageRetriever = (npmPackages: NpmPackage[]): PackageRetriever => {
    const npmPackageMap: Record<string, NpmPackage> = npmPackages
        .reduce((p, npmPackage) => ({...p, [`${npmPackage.name}-${npmPackage.version}`]: npmPackage}), {});

    return ({name, version}: NpmPackageRequest): Promise<NpmPackage> => Promise.resolve(npmPackageMap[`${name}-${version.request}`])
}