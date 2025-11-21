import { describe, it, expect, vi } from "vitest";
import { MockDexRouter } from "../dex/MockDexRouter";
import { submitOrder } from "../services/orderService";
import { getOrder } from "../db";

describe("Worker handles swap failure", () => {
  it("marks order as failed when executeSwap throws", async () => {
    const router = new MockDexRouter();
    
    // Force router failure
    vi.spyOn(router, "executeSwap").mockRejectedValue(
      new Error("forced failure")
    );

    const { id } = await submitOrder({
      type: "market",
      tokenIn: "A",
      tokenOut: "B",
      amount: 1,
    });

    // Wait until worker updates status
    const deadline = Date.now() + 12000;
    let order;
    while (Date.now() < deadline) {
      order = await getOrder(id);
      if (order.status === "failed") break;
      await new Promise(r => setTimeout(r, 400));
    }

    expect(order.status).toBe("failed");
    expect(order.error).toContain("forced failure");
  });
});
