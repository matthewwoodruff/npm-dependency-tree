import {DependencyTree} from "../../retriever.types";
import {formatTree} from "./expressTreeRetriever";

describe('retriever', () => {

    it('formats as a tree', () => {
        const tree: DependencyTree = {
            name: "react",
            version: "4.1.9",
            dependencies: [{
                name: "jest",
                version: "1.2.3",
                dependencies: []
            }]
        }

        const formattedTree = formatTree(tree);
        expect(formattedTree).toEqual(
            "└─ react\n" +
            "   ├─ version: 4.1.9\n" +
            "   └─ dependencies\n" +
            "      └─ jest\n" +
            "         ├─ version: 1.2.3\n" +
            "         └─ dependencies\n")
    })

})