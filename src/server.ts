import Fastify from 'fastify';
import websocketPlugin from '@fastify/websocket';
import dotenv from 'dotenv';
import ordersRoutes from './api/orders';
import { initDb } from './db';
import './worker/orderWorker';
dotenv.config();

export function buildServer() {
  const fastify = Fastify({ logger: true });

  // must be before routes
  fastify.register(websocketPlugin as any);
  fastify.register(ordersRoutes);

  return fastify;
}

const server = buildServer();

export default server;

if (require.main === module) {
  const port = Number(process.env.PORT || 3000);
  (async () => {
    try {
      await initDb();
      await server.listen({ port, host: '0.0.0.0' });
      console.log(`listening on ${port}`);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  })();
}
