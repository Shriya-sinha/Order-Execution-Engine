# Order Execution Engine (Mock DEX)

This repository contains a complete TypeScript backend for the **Order Execution Engine** (mock DEX implementation)

## Features
- POST `/api/orders/execute` — submit an order (returns `{ orderId }`)
- WS `/ws/orders/:orderId` — subscribe to order status updates
- Mocked DEX router (Raydium & Meteora) with price comparison and execution simulation
- BullMQ queue with concurrency and retry/exponential backoff
- PostgreSQL order history (can be replaced with in-memory for quick testing)
- Worker that processes orders and streams lifecycle states: `pending -> routing -> building -> submitted -> confirmed | failed`

## Extending to limit/sniper orders

**The current design prioritizes Market Orders because they are immediate and synchronous, providing the simplest, non-blocking flow to demonstrate the BullMQ queuing and execution pipeline.**

- **Limit orders:** Store the user's price condition (e.g., limit price); poll a price oracle or subscribe to a price feed; move the order to 'submitted' once the condition is met.
- **Sniper orders:** Monitor a specific blockchain or token launch event (e.g., token transfer event or liquidity addition); trigger the order to move to 'submitted' immediately when the event is detected.


## Quick start
1. Copy `.env.example` to `.env` and adjust `REDIS_URL` and `DATABASE_URL`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run local dev server:
   ```bash
   npm run dev
   ```
4. Submit an order:
   ```bash
   curl -X POST http://localhost:3000/api/orders/execute \
     -H "Content-Type: application/json" \
     -d '{"type":"market","tokenIn":"TOKENA","tokenOut":"TOKENB","amount":100}'
   ```
5. Connect to WS to receive updates for returned `orderId`:
   ```
   ws://localhost:3000/ws/orders/<orderId>
   ```

## Files included
See `src/` for all TypeScript source files.

## Extending to limit/sniper orders
- Limit orders: store price condition and poll or subscribe to price oracle; move to 'submitted' when condition met.
- Sniper orders: monitor token launch events and trigger immediate submission when event detected.

## Deliverables
- Postman collection: `postman_collection.json`
- Demo script: `scripts/demo.js`
- Unit tests: `src/tests/*` (vitest)
