var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var PORT = 3000;
app.get('/', (req, res) => {
    res.sendFile('/media/omar.jimenez/5ded71c1-2d2d-44ae-a911-86d53d7a4d37/HIXSA-DEV/webSockets/socketPractice/public/index.html');
});

//escuchando cuando exista una conexion

//sockeck --> socket del cliente que se esta conectando
io.on('connection', (socket) => {
    console.log('usuario: ' + socket.id);

    //canal por defecto en donde los usuarios de conectan
    var channel = 'channel-a';

    /*para que el cliente genere una coneccion de igual manera lo tenemos que configurar*/

    //emitir mensaje a todos los usuarios conectados
    //incluido yo 
    //io.emit('message', `El usuario ${socket.id} se ha conectado`, 'System');

    //Emitir a todos los demas menos a mi
    socket.broadcast.emit('message', `El usuario ${socket.id} se ha conectado`, 'System');

    //agregamos a nuestro socket a ese canal
    socket.join(channel); 


    //escuchamos el evento de front
    socket.on('message', (msj) => {
        //va a emitir este mensaje a los que esten conectados
        //io.emit('message', msj, socket.id);

        //enviar a los que estan en el canal
        io.sockets.in(channel).emit('message', msj, socket.id);

        //enviar a todos los del canal menos a mi 
        //socket.broadcast.to(channel).emit('message', msj, socket.id);
    });



    //el socket escucha cuando alguien se desconecta
    socket.on('disconnect', () => {
        //se emite el evento de desconeccion que va al front
        //socket.emit('disconnect', socket.id);

        console.log('bye usuario: ' + socket.id);
    });

    //creacion de cambio de canal
    socket.on('change channel', (newChannel) => {
        socket.leave(channel); //sale del canal
        socket.join(newChannel); //se agrega al nuevo canal
        channel = newChannel; //actualizamos la variable
        //emitimos ese nuevo cambio al front
        socket.emit('change channel', newChannel);
    });

});








http.listen(PORT, () => {
    console.log('escuchando en puerto 3000');
});