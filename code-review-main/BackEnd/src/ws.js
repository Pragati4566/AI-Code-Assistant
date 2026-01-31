// websocket.js
import WebSocket from "ws"

const wss = new WebSocket.Server({ port: 8080 })

wss.on("connection", (ws) => {
  console.log("Client connected") //client is establishing ocnnection //when client connected then msg will be send

  ws.on("message", (message) => {
    console.log("Received:", message.toString())  //here msg will be send

    // demo response (later AI yahin lagega)
    ws.send("Server received your message")
  })
})
