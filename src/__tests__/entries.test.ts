import { renderHook } from "@testing-library/react-hooks";
import { act } from "react-test-renderer";
import { useEntries } from "../entries";

describe("useEntries", () => {
  type Shape = {
    id: string;
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  it("returns entry with false ready flag if never set", () => {
    const hook = renderHook(() => useEntries<Shape>());
    expect(hook.result.current.get("unset").ready).toBe(false);
  });

  it("returns entry with data set to null if never set", () => {
    const hook = renderHook(() => useEntries<Shape>());
    expect(hook.result.current.get("unset").data).toBe(null);
  });

  it("allows setting entry", () => {
    const hook = renderHook(() => useEntries<Shape>());

    const data: Shape = {
      id: "bar",
    };

    act(() => {
      hook.result.current.set("foo", data);
      hook.rerender();
    });

    const result = hook.result.current.get("foo");
    expect(result.data).toBe(data);
  });

  it("provides a referentially stable set function", () => {
    const hook = renderHook(() => useEntries<Shape>());

    const initial = hook.result.current.set;

    const data: Shape = {
      id: "bar",
    };

    act(() => {
      hook.result.current.set("foo", data);
      hook.rerender();
    });

    const result = hook.result.current.get("foo");
    expect(result.data).toBe(data);

    expect(initial).toBe(hook.result.current.set);
  });
});
