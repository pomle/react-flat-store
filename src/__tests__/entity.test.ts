import { renderHook } from "@testing-library/react-hooks";
import { act } from "react-test-renderer";
import { useEntity } from "../entity";

describe("useEntity", () => {
  type Shape = {
    id: string;
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  it("combines useEntries and useCollection", () => {
    const a: Shape = {
      id: "A",
    };

    const b: Shape = {
      id: "B",
    };

    const hook = renderHook(() => useEntity<Shape>());

    act(() => {
      hook.result.current.entries.set("a", a);
      hook.result.current.entries.set("b", b);

      jest.advanceTimersByTime(150);

      hook.result.current.collection.set("my-list", ["a", "b"]);

      hook.rerender();
    });

    const entries = hook.result.current.collection.get("my-list");

    expect(entries?.length).toBe(2);
    expect(entries?.[0].data).toBe(a);
    expect(entries?.[1].data).toBe(b);
  });
});
