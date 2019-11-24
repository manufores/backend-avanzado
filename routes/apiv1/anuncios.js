'use strict';

const express = require('express');
const router = express.Router();
const Anuncio = require('../../models/Anuncio');
const jwtAuth = require('../../lib/jwtAuth');
const cote = require('cote');
const requester = new cote.Requester({ name: 'thumbnail client' });
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });

router.get('/', jwtAuth(),async (req, res, next) => {
    try {
        const nombre = req.query.nombre;
        const precio = req.query.precio;
        const tags = req.query.tags;
        const venta = req.query.venta;

        const start = parseInt(req.query.start) || 0;
        const limit = parseInt(req.query.limit) || 20;
        const fields = req.query.fields;
        const sort = req.query.sort;

        const filter = {};

        if (nombre) {
            filter.nombre = new RegExp('^' + req.query.nombre.toLowerCase() + '.*', 'i');
        }

        if (precio) {

            let rango = req.query.precio.split('-');

            if (rango.length === 1) {
                filter.precio = rango[0];
            }
            else if (rango.length === 2) {
                if (!rango[0]) {
                    filter.precio = { $lt: rango[1] };
                }
                else if (!rango[1]) {
                    filter.precio = { $gt: rango[0] };
                }
                else {
                    filter.precio = { $gte: rango[0], $lte: rango[1] };
                }
            }
        }


        if (tags) {
            if (tags.includes(tags) === true) {
                filter.tags = tags;
            }
        }

        if (typeof venta !== 'undefined') {

            filter.venta = venta;

        }

        const anuncios = await Anuncio.list({ filter: filter, start, limit, fields, sort });

        res.json({ success: true, anuncios: anuncios });
    } catch (err) {
        next(err);
    }
});

/**
 * GET /anuuncios:tags
 * Obtiene los tags de los anuncios.
 */

router.get('/tags', async function (req, res, next) {
    try {
        const tags = req.params.tags;

        const anuncio = await Anuncio.distinct('tags').exec();

        if (!anuncio) {
            res.status(404).json({ success: false });
            return;
        }

        res.json({ success: true, result: anuncio });

    } catch (err) {
        next(err);
    }
});

/**
 * POST /anuncios
 * Crear un anuncio
 */

router.post('/', upload.single('foto'), async (req, res, next) => {
    try {
        console.log(req.body);
        const data = req.body;

        const anuncio = new Anuncio(data); // se crea un anuncio

        
        console.log(req.file);

        const image=req.file.path;
        anuncio.foto=image;

        requester.send({
            type: 'crear thumbnail',
            path: image,
          });
        

        const anuncioGuardado = await anuncio.save() //Lo guardamos en la BBDD

        res.json({ success: true, result: anuncioGuardado });
    } catch (err) {
        next(err);
    }
});

/**
 * PUT /anuncios:id
 * Actualiza un anuncio
 */
router.put('/:id', async (req, res, next) => {
    try {
        const _id = req.params.id;
        const data = req.body;
        const anuncioGuardado = await Anuncio.findOneAndUpdate({ _id: _id }, data, { new: true }).exec();
        res.json({ success: true, result: anuncioGuardado });
    } catch (err) {
        next(err);

    }
})

/**
 * DELETE /anuncio:id
 * Elimina un anuncio
 */

router.delete('/:id', async (req, res, next) => {
    try {
        const _id = req.params.id;

        await Anuncio.deleteOne({ _id: _id }).exec();
        res.json({ success: true });

    } catch (err) {
        next(err);
    }
})


module.exports = router;