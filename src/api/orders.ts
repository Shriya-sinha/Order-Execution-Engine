import { FastifyInstance, FastifyRequest } from 'fastify';
import WebSocket from 'ws';
import { submitOrder } from '../services/orderService';
import { bindWs, unbindWs } from '../websocket/wsManager';

export default async function ordersRoutes(fastify: FastifyInstance) {
  // REST: submit order
  fastify.post('/api/orders/execute', async (request, reply) => {
    const body = request.body as any;
    const { type, tokenIn, tokenOut, amount } = body || {};

    if (!type || !tokenIn || !tokenOut || !amount) {
      return reply.status(400).send({ error: 'invalid input' });
    }

    const id = await submitOrder({ type, tokenIn, tokenOut, amount });
    reply.send({ orderId: id });
  });

  // WS: listen for order status by id
  fastify.get(
    '/ws/orders/:orderId',
    { websocket: true },
    (
      socket: WebSocket,
      req: FastifyRequest<{ Params: { orderId: string } }>
    ) => {
      const { orderId } = req.params;

      console.log('WS connected:', orderId);

      // bind this socket to the order id
      bindWs(orderId, socket);

      socket.on('close', () => {
        console.log('WS disconnected:', orderId);
        unbindWs(orderId);
      });
    }
  );
}
