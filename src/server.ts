import Fastify from 'fastify';
import websocketPlugin from '@fastify/websocket';
import dotenv from 'dotenv';
import ordersRoutes from './api/orders';
import { initDb } from './db';
import './worker/orderWorker';
dotenv.config();

const fastify = Fastify({ logger: true });
fastify.register(websocketPlugin as any);

fastify.register(ordersRoutes);

const port = Number(process.env.PORT || 3000);

const start = async () => {
  try {
    await initDb();
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`listening ${port}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
