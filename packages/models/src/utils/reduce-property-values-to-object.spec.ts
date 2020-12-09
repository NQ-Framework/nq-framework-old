import { reducePropertyValuesToObject } from "./reduce-property-values-to-object";
describe("reduce property values to object", () => {
  it("reduces flat values", () => {
    expect(
      reducePropertyValuesToObject([
        { name: "test", value: "test value" },
        { name: "test2", value: "test value 2" },
      ])
    ).toEqual({ test: "test value", test2: "test value 2" });
  });

  it("reduces complex array values", () => {
    expect(
      reducePropertyValuesToObject([
        {
          name: "test",
          value: [
            {
              name: "item",
              value: [
                { name: "prop1", value: "val1" },
                { name: "prop2", value: "val1" },
              ],
            },
            {
              name: "item",
              value: [
                { name: "prop1", value: "val2" },
                { name: "prop2", value: "val2" },
              ],
            },
          ],
        },
      ])
    ).toEqual({
      test: [
        { prop1: "val1", prop2: "val1" },
        { prop1: "val2", prop2: "val2" },
      ],
    });
  });

  it("reduces simple array values", () => {
    expect(
      reducePropertyValuesToObject([
        {
          name: "test",
          value: [
            {
              name: "item",
              value: [{ name: "test", value: "val1" }],
            },
            {
              name: "item",
              value: [{ name: "test", value: "val2" }],
            },
          ],
        },
      ])
    ).toEqual({
      test: ["val1", "val2"],
    });
  });
});
