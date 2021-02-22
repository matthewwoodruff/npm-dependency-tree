import * as core from "express-serve-static-core";
import treeify from "treeify";
import {
    DependencyTree,
    DependencyTreeRetriever,
    NpmPackageRequestCommand
} from "../../retriever.types";

export const configure = (express: core.Express, dependencyTreeRetriever: DependencyTreeRetriever) => {

    express.get("/:package/:version", async (req, res) => {
        const packageRequest: NpmPackageRequestCommand = {
            name: req.params.package,
            version: req.params.version
        }

        res.send(formatTree(await dependencyTreeRetriever(packageRequest)))
    })
};

type PackageData = {
    version: string,
    dependencies: PackageTree
}
type PackageTree = Record<string, PackageData>

const buildPackageTree = (tree: DependencyTree): PackageTree => ({
    [tree.name]: {
        version: tree.version,
        dependencies: tree.dependencies.map(buildPackageTree).reduce((p, c) => ({...p, ...c}), {})
    }
})

export const formatTree = (tree: DependencyTree): string =>
    treeify.asTree(buildPackageTree(tree), true, true)