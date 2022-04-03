import * as index from "../index";
import { createStore } from "../context";
import { useFlatStore } from "../flat-store";
import { toList, withData } from "../helper";

describe("index", () => {
  it("exports components", () => {
    expect(index.toList).toBe(toList);
    expect(index.withData).toBe(withData);
    expect(index.useFlatStore).toBe(useFlatStore);
    expect(index.createStore).toBe(createStore);
  });
});
