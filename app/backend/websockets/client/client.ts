import WebSocket from "ws";

const port = 6666;
const ws = new WebSocket(`ws://localhost:${port}`);

ws.on('open', () => {
	console.log(`connected to server.`);
	ws.send(`Hi from the client.`);
});
ws.on('message', (data) => {
	console.log(`Received message from server: ${data}`);
})
