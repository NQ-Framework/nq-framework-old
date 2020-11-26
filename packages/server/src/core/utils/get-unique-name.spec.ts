import { getUniqueName } from "./get-unique-name";

describe("getUniqueName", () => {
    it("returns desired name if no collision", () => {
        const result = getUniqueName("desired", []);
        expect(result).toEqual("desired");
    })

    it("returns desired name plus number if desired name in collision", () => {
        const result = getUniqueName("desired", ["desired"]);
        expect(result).toEqual("desired 1");
        const result2 = getUniqueName("desired", ["desired", "desired 1"]);
        expect(result2).toEqual("desired 2");
    })
})