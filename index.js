const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

var contract = require('./contractFunctions')
var bombs = contract.getAllBombs();

const server = express()
	.use(express.static(path.join(__dirname, 'public')))
	.set('views', path.join(__dirname, 'views'))
	.set('view engine', 'ejs')
	.get('/create',(req, res) => res.render('pages/create'))
	.get('/', (req, res) => res.render('pages/index'))
	.get('/bombs', (req,res) => res.render('pages/bombs', {bombs:bombs}))
	.listen(PORT, () => console.log(`Listening on ${ PORT }`))

var enc = require('./aes')
var io=require("socket.io")(server);
io.sockets.on('connection',function (socket) {
	socket.on('store',function(msg,time,publisher,email){
		aesMsg = enc.encrypt(msg);
		txAddr = contract.storeBomb(publisher, aesMsg);
		ethScan = "https://rinkeby.etherscan.io/tx/" + txAddr;
		//to-do mailServer.sendEmail(email)
		seconds = time*1000;
		io.emit('stored',ethScan,seconds)
		// setTimeout(() => nesto()); //POC ispise na stranici poruku nakon vremena
	});
});
io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
});