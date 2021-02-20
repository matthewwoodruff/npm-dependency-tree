import {NpmPackage, NpmPackageRequest} from "../retriever.types";

export type PackageRetriever = (npmPackageRequest: NpmPackageRequest) => Promise<NpmPackage>