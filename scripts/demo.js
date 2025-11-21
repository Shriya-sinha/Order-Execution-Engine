/*
Demo script:
- Submits 5 concurrent orders via HTTP
- Connects to each order's websocket to print lifecycle updates

Run:
  node scripts/demo.js
Ensure the server is running.
*/

const fetch = require('node-fetch');
const WebSocket = require('ws');

async function submitOrder() {
  const res = await fetch('http://localhost:3000/api/orders/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'market', tokenIn: 'TOKENA', tokenOut: 'TOKENB', amount: 100 })
  });
  const body = await res.json();
  return body.orderId;
}

async function listen(orderId) {
  const ws = new WebSocket(`ws://localhost:3000/ws/orders/${orderId}`);
  ws.on('open', () => console.log('ws open', orderId));
  ws.on('message', (m) => {
    console.log('WS', orderId, m.toString());
  });
  ws.on('close', () => console.log('ws close', orderId));
}

(async () => {
  const ids = await Promise.all(Array.from({length:5}).map(() => submitOrder()));
  console.log('submitted', ids);
  ids.forEach(id => listen(id));
})();
