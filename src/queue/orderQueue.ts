import { Queue } from 'bullmq';
import { Redis } from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const connection = new Redis(process.env.REDIS_URL!,{
  maxRetriesPerRequest:null,
});

export const orderQueue = new Queue('order-exec-queue', {
  connection,
});

// Enqueue order (with retries +exponential backoff)
export async function enqueueOrder(jobData: any) {
  return orderQueue.add('execute', jobData, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 500,
    },
  });
}