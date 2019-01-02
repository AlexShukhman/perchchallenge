/**
 * 
 * Index.js:
 *  * Set Up Server
 *  * Handle Socket
 * 
 * Notes:
 *  * Runs on localhost:3000
 *  * Uses Pug View Engine
 *  * Uses Socket.io socket
 * 
 */
// Some (not all) module requires
var express = require('express');
var favicon = require('serve-favicon');
var path = require('path');
var bodyparser = require('body-parser');
var logger = require('morgan');
var http = require('http');

/**
 * **********************************************
 * App Code (See Lower for Socket Code)
 * **********************************************
 */
var app = express();
var routes = require('./routes');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);

/**
 * **********************************************
 * Server Stuff Below (See Lower for Socket Code)
 * **********************************************
 */
var port = normalizePort(process.env.PORT || '3000'); // runs on env port or localhost:3000 if not set
app.set('port', port);

/**
 * Create HTTP Server
 */
var server = http.createServer(app);
server.listen(port);

server.on('error', onError);
server.on('listening', onListening);

// Normalize Port
function normalizePort(val) {
    var port = parseInt(val, 10);
	if (isNaN(port)) {
		// named pipe
		return val;
	}
	if (port >= 0) {
		// port number
		return port;
	}
	return false;
}

// Error handling
function onError(error) {
	var p = port;
	if (error.syscall !== 'listen') {
		throw error;
	}
	var bind = typeof p === 'string' ? 'Pipe ' + p : 'Port ' + p;
	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use');
			process.exit(1);
			break;
		default:
			throw error;
	}
}

// Listen Handling
function onListening() {
	console.log('now listening on port', port, '...');
	var s = server;
	var addr = s.address();
	var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
}

/**
 * **********************************************
 * Socket Code
 * **********************************************
 */
var io = require('socket.io').listen(server);

io.on('connection', (client) => {
    console.log('Socket: Client Connected!');

    client.on('join', (data) => {
        console.log('joined!');
        console.log('Data: ' + data);
    });
});