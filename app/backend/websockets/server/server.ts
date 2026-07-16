import { WebSocketServer } from "ws";

const port = 6666;
const wss = new WebSocketServer({port});

wss.on('connection', (ws) => {

	ws.on('message', (data) => {
		console.log(`Received message: ${data}`);
	})

	ws.send(`Hello from server.ts!`);
});

console.log(`Listening at port ${port}...`);
