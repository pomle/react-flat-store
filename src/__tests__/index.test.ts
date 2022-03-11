import { noop } from "../index";

describe("index", () => {
  it("runs a test", () => {
    expect(noop()).toBe(undefined);
  });
});
