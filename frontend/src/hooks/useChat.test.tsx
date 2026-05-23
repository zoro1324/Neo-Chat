import { describe, expect, it } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useChat } from "./useChat";

describe("useChat", () => {
  it("starts empty and flips on first send", async () => {
    const { result } = renderHook(() => useChat({ apiUrl: "http://test" }));

    expect(result.current.messages).toHaveLength(0);
    expect(result.current.hasStarted).toBe(false);

    await act(async () => {
      await result.current.sendMessage("Hello");
    });

    expect(result.current.hasStarted).toBe(true);
  });
});
