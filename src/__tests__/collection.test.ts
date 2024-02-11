import { renderHook } from "@testing-library/react-hooks";
import { act } from "react-test-renderer";
import { useCollection } from "../collection";

describe("useCollection", () => {
  type Shape = {
    id: string;
  };

  it("returns null if collection never", () => {
    const hook = renderHook(() =>
      useCollection<Shape>(() => {
        return { data: { id: "foo" } };
      }),
    );

    expect(hook.result.current.get("unset")).toBe(null);
  });

  it("calls supplied getter for each key in a set collection and returns as array", () => {
    const spy = jest.fn().mockReturnValue({ data: { id: "foo" } });

    const hook = renderHook(() => useCollection<Shape>(spy));

    act(() => {
      hook.result.current.set("my-key", ["a", "b", "c", "d"]);
      hook.rerender();
    });

    const result = hook.result.current.get("my-key");
    expect(result?.length).toBe(4);
    expect(spy).toHaveBeenCalledTimes(4);
    expect(spy.mock.calls[0][0]).toBe("a");
    expect(spy.mock.calls[1][0]).toBe("b");
    expect(spy.mock.calls[2][0]).toBe("c");
    expect(spy.mock.calls[3][0]).toBe("d");
  });
});
