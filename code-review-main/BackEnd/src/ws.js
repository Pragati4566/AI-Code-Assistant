// websocket.js
import WebSocket from "ws"

const wss = new WebSocket.Server({ port: 8080 })

wss.on("connection", (ws) => {
  console.log("Client connected")

  ws.on("message", (message) => {
    console.log("Received:", message.toString())

    // demo response (later AI yahin lagega)
    ws.send("Server received your message")
  })
})
