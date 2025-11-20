import { v4 as uuidv4 } from 'uuid';
import { createOrder, updateOrderStatus } from '../db';
import { enqueueOrder } from '../queue/orderQueue';
import { OrderPayload, OrderRecord } from '../types';

export async function submitOrder(payload: Omit<OrderPayload, 'id'>) {
  const id = uuidv4();
  const record: Partial<OrderRecord> = { id, ...payload, createdAt: new Date().toISOString(), status: 'pending' };
  await createOrder(record as any);
  await enqueueOrder(record);
  return id;
}

export async function setStatus(id: string, status: string, extras: any = {}) {
  await updateOrderStatus(id, status, extras);
}
