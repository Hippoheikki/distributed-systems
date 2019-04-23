let io = require('socket.io')(3001);

io.on('connection', (socket) => {
    console.log('user ' + socket.handshake.query.name + ' connected');
    const data = {name: socket.handshake.query.name, message: ''};
    socket.broadcast.emit("userCon", {data, date: Date.now()});

    socket.on('disconnect', () => {
        const data = {name: socket.handshake.query.name, message: ''};
        console.log('user ' + socket.handshake.query.name + ' disconnected');
        socket.broadcast.emit("userLeft", {data, date: Date.now()});
    });

    socket.on('message', (data) => {
        const feed = {data, date: Date.now()};
        io.emit('message', feed);
    });
});
