import { generateUniqueId } from "./generate-unique-id";
import { getFirebaseApp } from "../../firebase/initialize"
jest.mock("../../firebase/initialize");

describe("generateUniqueId", () => {
    it("call into firebase to generate id", async () => {
        const mock = getFirebaseApp as jest.Mock;
        mock.mockImplementation(() => ({
            firestore: () => ({
                collection: () => ({
                    doc: () => ({
                        id: 'mock id'
                    })
                })
            })
        }));

        const result = await generateUniqueId();
        expect(result).toBe("mock id");
        expect(mock).toHaveBeenCalledTimes(1);
    })
})