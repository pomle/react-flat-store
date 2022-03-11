import * as index from "../index";
import {
  toList,
  withData,
  useFlatStore,
  useFlatCollection,
} from "../flat-store";

describe("index", () => {
  it("exports components", () => {
    expect(index.toList).toBe(toList);
    expect(index.withData).toBe(withData);
    expect(index.useFlatStore).toBe(useFlatStore);
    expect(index.useFlatCollection).toBe(useFlatCollection);
  });
});
