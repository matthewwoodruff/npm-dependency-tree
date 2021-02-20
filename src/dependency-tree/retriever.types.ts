export type Version = {
    request: string,
    raw: string
}

export type NpmPackageRequest = {
    name: string;
    version: Version;
}

export type NpmPackageRequestCommand = {
    name: string;
    version: string;
}

export interface NpmPackage {
    name: string;
    version: string;
    dependencies: Dependency[];
    ok: boolean
}

export type Dependency = {
    name: string;
    version: string;
}

export type DependencyTree = Dependency & {
    dependencies: DependencyTree[]
}

export type DependencyTreeRetriever = (npmPackageRequestCommand: NpmPackageRequestCommand) => Promise<DependencyTree>;