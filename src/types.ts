import { WebSocket } from 'ws';

interface FastifyWsConnection {
  socket: WebSocket;
}

export type OrderStatus = 'pending' | 'routing' | 'building' | 'submitted' | 'confirmed' | 'failed';

export interface OrderPayload {
  id: string;
  type: 'market' | 'limit' | 'sniper';
  tokenIn: string;
  tokenOut: string;
  amount: number; // base units
}

export interface OrderRecord extends OrderPayload {
  createdAt: string;
  status: OrderStatus;
  txHash?: string;
  error?: string;
  route?: any; // To store mocked route details
}