import * as index from "../index";
import { createStoreContext } from "../context";
import { useStore } from "../store";
import { toList, withData } from "../helper";

describe("index", () => {
  it("exports components", () => {
    expect(index.toList).toBe(toList);
    expect(index.withData).toBe(withData);
    expect(index.useStore).toBe(useStore);
    expect(index.createStoreContext).toBe(createStoreContext);
  });
});
