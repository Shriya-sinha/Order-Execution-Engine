import { describe, it, expect } from "vitest";
import { createOrder, getOrder } from "../db";

describe("DB schema integrity", () => {
  it("creates order with all fields", async () => {
    await createOrder({
      id: "schema-test-1",
      type: "market",
      tokenIn: "A",
      tokenOut: "B",
      amount: 5,
      status: "pending",
    });

    const o = await getOrder("schema-test-1");

    expect(o.id).toBe("schema-test-1");
    expect(o.type).toBe("market");
    expect(o.token_in).toBe("A");
    expect(o.status).toBe("pending");
  });
});
