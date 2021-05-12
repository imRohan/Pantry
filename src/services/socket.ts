// External Deps
const socketIo = require('socket.io')

class SocketServer {
  public io

  constructor(server) {
    this.io = socketIo(server)
    this.io.on('connection', (socket) => {
      socket.emit('connected', 'connected')
    })
  }

  public accountUpdated(pantryID: string) {
    this.emit(`${pantryID}-updated`, 'Pantry updated')
  }

  private emit(event: string, body: string) {
    this.io.emit(event, body)
  }
}

export default SocketServer
