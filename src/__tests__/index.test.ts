import * as index from "../index";
import { createStoreContext } from "../context";
import { useEntity } from "../entity";
import { toList, withData } from "../helper";

describe("index", () => {
  it("exports components", () => {
    expect(index.toList).toBe(toList);
    expect(index.withData).toBe(withData);
    expect(index.useEntity).toBe(useEntity);
    expect(index.createStoreContext).toBe(createStoreContext);
  });
});
