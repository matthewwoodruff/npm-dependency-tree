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

        // res.send(formatTree(await dependencyTreeRetriever(packageRequest)))
        res.send(await dependencyTreeRetriever(packageRequest))
    })
};

type Asd = {
    version: string,
    dependencies: PackageView
}
type PackageView = Record<string, Asd>

const build = (tree: DependencyTree): PackageView => ({
    [tree!.name]: {
        version: tree!.version,
        dependencies: tree!.dependencies.map(build).reduce((p, c) => ({...p, ...c}), {})
    }
})

export const formatTree = (tree: DependencyTree): string =>
    treeify.asTree(build(tree), true, true)