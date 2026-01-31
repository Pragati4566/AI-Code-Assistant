const WebSocket = require('ws')

function initWebSocket(server) {
  const wss = new WebSocket.Server({ server })

  wss.on('connection', (ws) => {
    console.log('WebSocket client connected') //client is establishing ocnnection //when client connected then msg will be send

    ws.on('message', (msg) => {
      ws.send('Hello from WebSocket') //here msg will be send
    })
  })
}
module.exports = initWebSocket
