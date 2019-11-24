'use strict';

const jwt = require('jsonwebtoken');

module.exports = function () {
  return function (req, res, next) {
    // leer el token que me mandan
    const token = req.body.token || req.query.token || req.get('Authorization');
    console.log(token);
    // si no tengo token no dejo pasar
    if (!token) {
      const err = new Error('No hay token');
      err.status = 401;
      next(err);
      return;
    }

    // si el token es invalido no dejo pasar
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        const err = new Error('Token Erroneo o Expirado');
        err.status = 401;
        next(err);
        return;
      }
      req.apiUserId = payload._id;
      next();
    });


  }
}
