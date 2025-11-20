import { FastifyInstance } from 'fastify';
import { submitOrder } from '../services/orderService';
import { bindWs, unbindWs } from '../websocket/wsManager';
import WebSocket from 'ws';

export default async function ordersRoutes(fastify: FastifyInstance) {
  fastify.post('/api/orders/execute', async (request, reply) => {
    const body = request.body as any;
    const { type, tokenIn, tokenOut, amount } = body || {};
    if (!type || !tokenIn || !tokenOut || !amount) return reply.status(400).send({ error: 'invalid input' });

    const id = await submitOrder({ type, tokenIn, tokenOut, amount });

    reply.send({ orderId: id });
  });

  fastify.get('/ws/orders/:orderId', { websocket: true }, (connection: any, req: any) => {
    const orderId = req.params.orderId;
    const ws: WebSocket = connection.socket;
    bindWs(orderId, ws);
    ws.on('close', () => unbindWs(orderId));
  });
}
