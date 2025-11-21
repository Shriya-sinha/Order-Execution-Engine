// import { FastifyInstance } from 'fastify';
// import { bindWs, unbindWs } from './wsManager';
// import { WebSocket } from 'ws';

// export default async function wsRoutes(fastify: FastifyInstance) {

//   fastify.get('/ws/orders/:orderId', { websocket: true }, (connection: any, req: any) => {
//     const ws: WebSocket = connection.socket;
//     const { orderId } = req.params as any;

//     console.log("WS connected:", orderId);

//     bindWs(orderId, ws);

//     ws.on('close', () => {
//       console.log("WS closed:", orderId);
//       unbindWs(orderId);
//     });
//   });

// }
