import nodeFetch from "node-fetch";
import {NpmPackage, NpmPackageRequest} from "../../retriever.types";

type NpmRegistryPackage = {
    name: string;
    version: string,
    dependencies?: Record<string, string>
}

export const NpmRegistryClient = (endpoint: string) => ({
    getNpmPackage: async (npmPackageRequest: NpmPackageRequest): Promise<NpmPackage> => {
        const {name, version} = npmPackageRequest;
        const url = `${endpoint}/${name}/${version.request}`;
        const responsePromise = await nodeFetch(url, {method: "GET"});

        if (responsePromise.status != 200) {
            console.error("Request failed for", url, npmPackageRequest, responsePromise.status)
            return {
                name,
                version: version.request,
                ok: false,
                dependencies: [],
            }
        }

        const npmPackageResponse: NpmRegistryPackage = await responsePromise.json();
        const dependencies = npmPackageResponse.dependencies ? Object.keys(npmPackageResponse.dependencies)
            .map(dependency => ({
                name: dependency,
                version: npmPackageResponse.dependencies![dependency]
            })) : [];

        return {
            name: npmPackageResponse.name,
            version: npmPackageResponse.version,
            ok: true,
            dependencies,
        };
    }
})