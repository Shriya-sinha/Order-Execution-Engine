import { describe, it, expect, vi } from "vitest";
import { MockDexRouter } from "../dex/MockDexRouter";

describe("Router chooses Raydium when price is better", () => {
  it("correctly selects raydium", async () => {
    const router = new MockDexRouter();

    vi.spyOn(router, "getRaydiumQuote").mockResolvedValue({
      price: 100,
      fee: 0.001,
      dex: "raydium",
    });

    vi.spyOn(router, "getMeteoraQuote").mockResolvedValue({
      price: 120,
      fee: 0.002,
      dex: "meteora",
    });

    const best = router.chooseBest(
      await router.getRaydiumQuote(10),
      await router.getMeteoraQuote(10)
    );

    expect(best.dex).toBe("raydium");
  });
});
