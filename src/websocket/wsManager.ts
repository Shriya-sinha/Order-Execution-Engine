import WebSocket from 'ws';
import { OrderStatus } from '../types';

const map = new Map<string, WebSocket>();

export function bindWs(orderId: string, ws: WebSocket) {
  map.set(orderId, ws);
}

export function unbindWs(orderId: string) {
  map.delete(orderId);
}

export function sendStatus(orderId: string, status: OrderStatus, payload: any = {}) {
  const ws = map.get(orderId);
  if (!ws || ws.readyState !== ws.OPEN) return;
  ws.send(JSON.stringify({ orderId, status, ...payload }));
}
