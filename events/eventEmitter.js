const EventEmitter = require('events');
const WebSocket = require('ws');

class NotifyEmitter extends EventEmitter {}

const notifyEmitter = new NotifyEmitter();
const wss = new WebSocket.Server({ port: 8080 });

wss.broadcast = function broadcast(product) {
    console.log('broadcasting to all the stores : ', product);
    // eslint-disable-next-line
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(product);
        }
    });
};

notifyEmitter.on('notify', (product) => {
    console.log('notify all the stores for the product update', product);
    // Broadcast to all stores.
    wss.broadcast(product);
});


module.exports = notifyEmitter;
