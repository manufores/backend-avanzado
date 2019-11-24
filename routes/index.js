var express = require('express');
var router = express.Router();
const Anuncio = require('../models/Anuncio');

//destructuring
const { query, validationResult } = require('express-validator');

/* GET home page. */

// router.get(foto, (req, res) =>{ res.sendFile(path.join(__dirname, foto)); })

router.get('/', async (req, res, next) => {
  try {
    const nombre = req.query.nombre;
    const venta = req.query.venta;
    const precio = req.query.precio;
    const tags =  req.query.tags;
    const start = parseInt(req.query.start) || 0;
    const limit = parseInt(req.query.limit) || 20;
    const fields = req.query.fields;
    const sort = req.query.sort;

    const filter = {};

    if (nombre) {
      filter.nombre = nombre;
    }

    if (typeof precio !== 'undefined') {
      filter.precio = precio;
    }

    if (tags) {
      filter.tags = tags;
    }

    

    const anuncios = await Anuncio.list({ filter: filter, start, limit, fields, sort });
    res.locals.results = anuncios;
    res.render('index');

    //const anuncios = await Anuncio.find().exec();
    //res.json({ success:true, anuncios: anuncios});
  } catch (err) {
    next(err);
  }
});

router.get('/apiv1/anuncios?/tag/:tag/venta/:venta', (req, res, next) => {
  console.log('req.apiv1', req.apiv1);
  res.send('Ok');
  //next();
});

module.exports = router;
