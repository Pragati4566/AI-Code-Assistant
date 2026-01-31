const WebSocket = require('ws')

let wss  //representing server 

function initWebSocket(server) {
  wss = new WebSocket.Server({ server })

  wss.on('connection', (ws) => {
    console.log('Client connected via WebSocket')

    ws.on('message', (message) => {               //ws is single client conection
      console.log('Message from client:', message.toString())

      ws.send(JSON.stringify({
        type: 'info',
        message: 'Message received on server'
      }))
    })

    ws.on('close', () => {
      console.log('Client disconnected')
    })
  })
}

module.exports = initWebSocket
