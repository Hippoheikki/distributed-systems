let io = require('socket.io')(3001);

io.on('connection', (socket) => {
    console.log('user ' + socket.handshake.query.name + ' connected');
    socket.broadcast.emit("userCon", socket.handshake.query.name);

    socket.on('disconnect', () => {
        console.log('user ' + socket.handshake.query.name + ' disconnected');
        socket.broadcast.emit("userLeft", socket.handshake.query.name);
    });

    socket.on('message', (data) => {
        io.emit('message', data);
    });
});
