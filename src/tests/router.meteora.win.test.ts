import { describe, it, expect, vi } from "vitest";
import { MockDexRouter } from "../dex/MockDexRouter";

describe("Router chooses Meteora when price is lower", () => {
  it("correctly selects meteora", async () => {
    const router = new MockDexRouter();

    vi.spyOn(router, "getRaydiumQuote").mockResolvedValue({
      price: 150,
      fee: 0.002,
      dex: "raydium",
    });

    vi.spyOn(router, "getMeteoraQuote").mockResolvedValue({
      price: 110,
      fee: 0.001,
      dex: "meteora",
    });

    const best = router.chooseBest(
      await router.getRaydiumQuote(10),
      await router.getMeteoraQuote(10)
    );

    expect(best.dex).toBe("meteora");
  });
});
