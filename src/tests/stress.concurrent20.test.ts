import { describe, it, expect } from "vitest";
import { submitOrder } from "../services/orderService";
import { getOrder } from "../db";

describe("Stress test: 20 concurrent jobs", () => {
  it("should process 20 jobs without deadlocks", async () => {
    const orders = await Promise.all(
      [...Array(20)].map(() =>
        submitOrder({ type: "market", tokenIn: "A", tokenOut: "B", amount: 10 })
      )
    );

    const ids = orders.map((o: { id: string }) => o.id);

    const deadline = Date.now() + 30000;
    const results: Record<string, string> = {};

    while (Date.now() < deadline) {
    for (const id of ids) {
        if (!results[id]) {
        const o = await getOrder(id);
        if (o && (o.status === "confirmed" || o.status === "failed")) {
            results[id] = o.status;
        }
        }
    }
    if (Object.keys(results).length === ids.length) break;
    await new Promise(r => setTimeout(r, 500));
    }

    expect(Object.keys(results).length).toBe(20);
  }, 35000);
});
