'use strict';

const mongoose = require('mongoose');

//definimos un esquema
const anuncioSchema = mongoose.Schema({
    nombre: { type: String, index: true },
    venta: { type: Boolean, index: true },
    precio: { type: Number, index: true },
    foto: String,
    tags: { type: [String], index: true }
});

anuncioSchema.statics.list = function ({ filter, start, limit, fields, sort }) { //usamos el destructuring poniendo las llaves y de esa manera conseguimos que no hace falta pasarle los campos por orden desde el controlador
    const query = Anuncio.find(filter);
    query.skip(start);
    query.limit(limit);
    query.select(fields);
    query.sort(sort);


    return query.exec();
}


//creamos el modelo de anuncio
const Anuncio = mongoose.model('Anuncio', anuncioSchema);

module.exports = Anuncio;