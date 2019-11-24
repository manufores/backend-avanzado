'use strict';

//cargar libreria de mongoose
const mongoose = require('mongoose');
const conn = mongoose.connection;

mongoose.set('useFindAndModify', false);

//gestionar eventos de conexion
conn.on('err', err => {
    console.log('Error de conexion', err);
    process.exit(1);
});

conn.once('open', () => {
    console.log('Conectado a MongoDB en', conn.name);

});

//conectar
mongoose.connect('mongodb://localhost/nodepop', { useNewUrlParser: true });


//exportar la conexion (opcional)
module.exports = conn;