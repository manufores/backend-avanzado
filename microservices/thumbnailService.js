'use strict';

// Servicio de cambio de moneda

const cote = require('cote');
var Jimp = require('jimp');

// declarar el microservicio
const responder = new cote.Responder({ name: 'thumbnail converter' });

// lógica del servicio
responder.on('crear thumbnail', (req, done) => {
    const image='./'+req.path;
    console.log(image);
    const resized='./resized/';
    // const imageResize = req.path;
    const imageResize = resized+req.path;

    // open a file called "lenna.png"
    Jimp.read(image, (err, imager) => {
        if (err) throw err;
        imager
            .resize(100, 100) // resize
            .quality(60) // set JPEG quality
            .write(imageResize); // save
    });
});
