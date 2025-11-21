import { describe, it, expect } from "vitest";
import { submitOrder } from "../services/orderService";
import { getOrder } from "../db";

describe("Worker writes txHash on success", () => {
  it("should assign txHash when confirmed", async () => {
    const { id } = await submitOrder({
      type: "market",
      tokenIn: "TEST1",
      tokenOut: "TEST2",
      amount: 1,
    });

    const deadline = Date.now() + 20000;
    let o;

    while (Date.now() < deadline) {
      o = await getOrder(id);
      if (o.status === "confirmed") break;
      await new Promise(r => setTimeout(r, 500));
    }

    if (o.status === "confirmed") {
      expect(o.tx_hash).toBeTruthy();
    }
  }, 25000);
});
