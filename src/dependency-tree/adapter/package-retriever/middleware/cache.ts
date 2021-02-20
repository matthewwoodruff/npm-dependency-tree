import {PackageRetriever} from "../../../port/packageRetriever";
import {NpmPackage, NpmPackageRequest} from "../../../retriever.types";

export const buildCache = (packageRetriever: PackageRetriever): PackageRetriever => {
    let cache: Record<string,Promise<NpmPackage>> = {};
    return (npmPackageRequest: NpmPackageRequest): Promise<NpmPackage> => {
        const npmPackageKey = JSON.stringify(npmPackageRequest);

        const cacheElement = cache[npmPackageKey];
        if (cacheElement) return cacheElement;

        const npmPackageResponsePromise = packageRetriever(npmPackageRequest);
        cache[npmPackageKey] = npmPackageResponsePromise;

        return npmPackageResponsePromise;
    }
}