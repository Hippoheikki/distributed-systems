let io = require('socket.io')(3001);

io.on('connection', (socket) => {
    console.log('user ' + socket.handshake.query.name + " connected");
    socket.broadcast.emit("userCon", socket.handshake.query.name);
});
