require('dotenv').config()
const http = require('http')
const app = require('./src/app')
const initWebSocket = require('./src/websocket')

const server = http.createServer(app) // server connected to app(where express and rest apis will work)

initWebSocket(server) // websocket get connected to server

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000') //server will run on this port (pehle here app.listen because server diretly app ko handover kar deta tha but now we have websocket here also)
})
