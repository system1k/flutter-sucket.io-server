// Importación con nombre
const {io} = require('../index.js');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();

bands.addBand(new Band('Queen'));
bands.addBand(new Band('Nirvana'));
bands.addBand(new Band('The Rolling Stones'));
bands.addBand(new Band('The Beatles'));

//Mensajes de Sockets
io.on('connection', client => {

    console.log('cliente conectado');

    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => {
        console.log('cliente desconectado');
    });

    client.on('mensaje', (payload) => {
        console.log('Mensaje!!!', payload);

        io.emit('mensaje', {admin: 'Nuevo mensaje'});
    });

    client.on('vote-band', (payload) => {
        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands()); // Emite a todos incluido a si mismo
        //client.broadcast.emit('new-message', 'Fermin'); // Emite a todos excepto a si mismo
    });

    client.on('add-band', (payload) => {
        const newBand = new Band(payload.name)
        bands.addBand(newBand);
        io.emit('active-bands', bands.getBands()); 
    });

    client.on('delete-band', (payload) => {
        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });
});