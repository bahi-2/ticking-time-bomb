console.log("Bar nesto")
var io=require('socket.io').listen(5000);
io.sockets.on('connection',function (socket) {
	socket.on('encrypt',function(msg,time){console.log('saljem..');
		io.emit('encrypted',msg);
	});
});
io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
});
