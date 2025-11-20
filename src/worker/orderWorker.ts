import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import dotenv from 'dotenv';
import { MockDexRouter } from '../dex/MockDexRouter';
import { sendStatus } from '../websocket/wsManager';
import { setStatus } from '../services/orderService';
dotenv.config();
const connection = new IORedis(process.env.REDIS_URL!,{
  maxRetriesPerRequest:null,
});

const router = new MockDexRouter();

const worker = new Worker('order-exec-queue', async (job) => {
  const { id, type, tokenIn, tokenOut, amount } = job.data;
  try {
    sendStatus(id, 'routing');
    await setStatus(id, 'routing');

    const [rQuote, mQuote] = await Promise.all([
      router.getRaydiumQuote(amount),
      router.getMeteoraQuote(amount),
    ]);
    const best = router.chooseBest(rQuote, mQuote);

    sendStatus(id, 'building', { route: best.dex });
    await setStatus(id, 'building');

    sendStatus(id, 'submitted');
    await setStatus(id, 'submitted');

    const { txHash, executedPrice } = await router.executeSwap(best, id);

    sendStatus(id, 'confirmed', { txHash, executedPrice });
    await setStatus(id, 'confirmed', { txHash });

    return { txHash, executedPrice };
  } catch (err: any) {
    const message = err?.message || String(err);
    sendStatus(id, 'failed', { error: message });
    await setStatus(id, 'failed', { error: message });
    throw err;
  }
}, { connection });

worker.on('failed', (job, err) => {
  console.error('job failed', job.id, err?.message);
});

export default worker;
