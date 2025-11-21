import { describe, it, expect } from "vitest";
import server from "../server";

describe("Order API validation", () => {
  it("requires amount field", async () => {
    const res = await server.inject({
      method: "POST",
      url: "/api/orders/execute",
      payload: {
        type: "market",
        tokenIn: "SOL",
        tokenOut: "USDC"
      },
    });

    expect(res.statusCode).toBe(400);
  });
});
