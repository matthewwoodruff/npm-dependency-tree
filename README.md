# Npm dependency tree

[![Build Status](https://travis-ci.org/matthewwoodruff/npm-dependency-tree.svg?branch=main)](https://travis-ci.org/matthewwoodruff/npm-dependency-tree)

### How to run

`yarn start` - Starts the server

`yarn build` - Runs the typescript compilation, tests and dependency audit

This has been tested with `node 12/14` and `yarn 1.22.10` 

### Design
The retriever returns a dependency tree for a package and version using package retriever and version resolver functions. The retriever recursively finds the dependencies of the package using the same mechanism. 

The codebase is influenced by hexagonal architecture where ports and adapters allow for separation of core domain logic from external expectations. Package retriever and version resolver ports are defined and implementations found in the adapter package.

#### Package retriever
A port defining for a package request it must return a package. There are two of implementations of this function that can be composed to provide additional benefit.

`npmRegistryClient` Used to retrieve a package from npm registry

`circularDependencyPreventer` Used to prevent circular dependencies by identifying on occurrence of a package as being canonical. This package retriever is also request-based so that its functionality is isolated to a specific api call. 

#### Version resolver
A port to resolve a given version to a specific version. The versions defined in a package's dependency list will often not be a specific value such as 1.2.3, often it may look like ^1.2.3. The version resolver decides which specific version to use as a request to npm registry can only be made with specific values or an alias. There is currently only one implementation that either finds the minimum version for a specification or returns the specification if an alias, or an invalid semver. Another implementation could be added to return the latest version but this would require additional requests to npm registry. 

#### Middleware
Additional middleware enables caching and throttling. 

`cache` Used to cache the response of a function given the argument to the function. This has avoided repeat network requests for the same package and version, and to speed up response times for subsequent requests.

`throttler` Used to limit the number of concurrent function invocations that result in a promise. This is to avoid spamming npm registry and reaching network request limits of a machine.

### Assumptions

1. No scanning for dev dependencies
2. If the version is a valid semver then take the minimum. For example if the dependency specifies `^1.2.3` then use `1.2.3` as the version. This may fail for versions such as `*` which resolves to `0.0.0`, and `2 || 3` which resolves to `2.0.0`.
3. If the version is not a valid semver then attempt to get that version and assume it's an alias. For example `latest` isn't a valid semver so `latest` is used as the version.

### Extensions

1. Resolve a version specification to the latest matching version. For example given `^1.2.3` then the latest version could be retrieved from npm that satisfies `^1.2.3`. A new version resolver could be implemented for this and wired in the `index.ts` file.
2. Resolve a version specification to multiple versions. Similar to the previous but perhaps taking the `x` most recent versions.
3. Use a cache service such as redis to allow for multiple server instances.
4. Support dev dependencies
5. Add more testing at a functional level to ensure the api is constructed correctly.

