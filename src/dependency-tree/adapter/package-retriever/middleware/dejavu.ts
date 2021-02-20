import {PackageRetriever} from "../../../port/packageRetriever";
import {NpmPackage, NpmPackageRequest} from "../../../retriever.types";

export interface CanonicalNpmPackage extends NpmPackage {
    canonical?: boolean
}

export const buildDejavu = (packageRetriever: PackageRetriever): PackageRetriever => {
    let seen: Record<string, boolean> = {};
    return async (npmPackageRequest: NpmPackageRequest): Promise<CanonicalNpmPackage> => {
        const npmPackageResponse = await packageRetriever(npmPackageRequest);

        const npmPackageKey = JSON.stringify(npmPackageRequest);

        if (seen[npmPackageKey]) {
            return {
                ...npmPackageResponse,
                dependencies: [],
            }
        }

        seen[npmPackageKey] = true;

        return {
            ...npmPackageResponse,
            canonical: true
        };
    }
}