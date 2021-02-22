# Npm dependency tree

[![Build Status](https://travis-ci.org/matthewwoodruff/npm-dependency-tree.svg?branch=main)](https://travis-ci.org/matthewwoodruff/npm-dependency-tree)

### Design
Given a package name and version a package is retrieved using package retriever and version resolver functions. The dependencies of the found package are then requested recursively through the same process. 

#### Hexagonal architecture
The codebase is influenced by hexagonal architecture where ports and adapters are used to separate core domain logic from external expectations. Ports are defined for the package retriever and version resolver.

#### Package retriever
An interface that defines for a package request it must return a package. There are two of implementations of this function that can be composed to provide additional benefit.

**npmRegistryClient** - Used to retrieve a package from npm registry
**circularDependencyPreventer** - Used to prevent circular dependencies by identifying on occurrence of a package as being canonical. This package retriever is also request-based in the solution so that its functionality is isolated to a specific api call. 

#### Version resolver
An interface to resolve a given version. The versions defined in a package's dependency list will often not be a specific value such as 1.2.3, often it may look like ^1.2.3. The version resolver is used to decide which specific version to use as a request to npm registry can only be made with specific values. There is currently only one implementation that either finds the minimum version for a specification or returns the specification if an alias or an invalid semver. Another implementation could be added to return the latest version but this would require additional requests to npm registry. 

#### Middleware
Generic middleware is used for caching and throttling. 

*cache* - Used to cache the response of a function given the argument to the function. This has avoided repeat network requests for the same package and version, and to speed up response times for subsequent requests.
*throttler* - Used to limit the number of concurrent function invocations that result in a promise. This is to avoid spamming npm registry and reaching network request limits of a machine.


### Assumptions

only dependencies not dev deps
if the version is a valid semver then take the minimum
- * -> 0.0.0 may not exist
- 2 || 3 -> 2.0.0 which may not exist
if the version is not a valid semver then attempt to get that version
- queries with potentially invalid data

### Additional things

given a version specification such as 2 || 3
- Could find latest version or all version satisfying specification
- Can implement a new version resolver for this
- If returning multiple versions. Could add a limit, say latest 5
use cache such as redis
More testing
Also look at dev dependencies

