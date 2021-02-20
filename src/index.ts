import {NpmRegistryClient} from "./dependency-tree/adapter/package-retriever/npmRegistryClient";
import {buildDejavu} from "./dependency-tree/adapter/package-retriever/middleware/dejavu";
import express from "express";
import {NpmPackage, NpmPackageRequest} from "./dependency-tree/retriever.types";
import {buildDependencyTreeRetriever} from "./dependency-tree/retriever";
import {configure} from "./dependency-tree/adapter/tree-retreiver/expressTreeRetriever";
import {resolve} from "./dependency-tree/adapter/version-resolver/simpleVersionResolver";
import {buildThrottler} from "./dependency-tree/middleware/promiseThrottler";
import {buildCache} from "./dependency-tree/middleware/cache";

const npmRegistryClient = NpmRegistryClient("https://registry.npmjs.org");

const throttler = buildThrottler(100);
const throttlingPackageRetriever = (npmPackageRequest: NpmPackageRequest): Promise<NpmPackage> =>
    throttler(() => npmRegistryClient.getNpmPackage(npmPackageRequest))

const cachingPackageRetriever = buildCache(throttlingPackageRetriever);

const dependencyTreeRetriever = buildDependencyTreeRetriever(resolve, cachingPackageRetriever, buildDejavu);


const expressApp = express();

configure(expressApp, dependencyTreeRetriever);
const port = 3000;
expressApp.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})

