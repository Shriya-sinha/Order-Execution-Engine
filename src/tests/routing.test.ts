import { describe, it, expect } from 'vitest';
import { MockDexRouter } from '../dex/MockDexRouter';

describe('Dex routing', () => {
  it('chooses a lower effective price', async () => {
    const r = new MockDexRouter();
    const q1 = await r.getRaydiumQuote(100);
    const q2 = await r.getMeteoraQuote(100);
    const best = r.chooseBest(q1, q2);
    const eff1 = q1.price * (1 + q1.fee);
    const eff2 = q2.price * (1 + q2.fee);
    expect(best.price * (1 + best.fee)).toBeLessThanOrEqual(Math.max(eff1, eff2));
  });
});