import { describe, it, expect } from "vitest";
import server from "../server";

describe("Order API rejects invalid type", () => {
  it("returns 400 for type=wrongvalue", async () => {
    const res = await server.inject({
      method: "POST",
      url: "/api/orders/execute",
      payload: {
        type: "wrongvalue",
        tokenIn: "A",
        tokenOut: "B",
        amount: 10,
      },
    });

    expect(res.statusCode).toBe(400);
  });
});
