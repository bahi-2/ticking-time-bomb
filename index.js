const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const server = express()
	.use(express.static(path.join(__dirname, 'public')))
	.set('views', path.join(__dirname, 'views'))
	.set('view engine', 'ejs')
	.get('/upload',(req, res) => res.render('pages/upload'))
	.get('/', (req, res) => res.render('pages/index'))
	.get('/bombs', (req,res) => res.render('pages/bombs'))
	.listen(PORT, () => console.log(`Listening on ${ PORT }`))

var enc = require('./aes')
var io=require("socket.io")(server);
io.sockets.on('connection',function (socket) {
	socket.on('encrypt',function(msg,time){
		io.emit('encrypted',enc.encrypt(msg));
	});
});
io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
});
// setInterval(() => io.emit('time', new Date().toTimeString()), 1000);