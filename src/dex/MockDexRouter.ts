import { sleep } from '../utils/sleep'
import { log } from  '../utils/logger'

export interface DexQuote { price: number; fee: number; dex: 'raydium' | 'meteora' }

export class MockDexRouter {
  basePrice = 100; // mock price for token pair

  async getRaydiumQuote(amount: number): Promise<DexQuote> {
    await sleep(200 + Math.random() * 150);
    const price = this.basePrice * (0.98 + Math.random() * 0.04);
    const fee = 0.003;
    log('raydium quote', { price, fee });
    return { price, fee, dex: 'raydium' };
  }

  async getMeteoraQuote(amount: number): Promise<DexQuote> {
    await sleep(200 + Math.random() * 150);
    const price = this.basePrice * (0.97 + Math.random() * 0.05);
    const fee = 0.002;
    log('meteora quote', { price, fee });
    return { price, fee, dex: 'meteora' };
  }

  chooseBest(a: DexQuote, b: DexQuote) {
    const effA = a.price * (1 + a.fee);
    const effB = b.price * (1 + b.fee);
    return effA <= effB ? a : b;
  }

  async executeSwap(dex: DexQuote, orderId: string) {
    await sleep(2000 + Math.random() * 1000);
    if (Math.random() < 0.03) throw new Error('mock execution failed');
    const txHash = `MOCKTX-${orderId.slice(0, 8)}-${Math.floor(Math.random() * 1e6)}`;
    const executedPrice = dex.price;
    log('executed', { dex: dex.dex, txHash, executedPrice });
    return { txHash, executedPrice };
  }
}
