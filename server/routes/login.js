const express = require('express');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const app = express();


app.post('/login', (req, res) => {

	let body = req.body;

	Usuario.findOne( {email: body.email}, (err, usuarioDB) => {
		//si ocurrio algun error con la BD
		if(err){
			return res.status(500).json({
				ok: false,
				err
			});
		}
		//si el usuario no existe
		if( !usuarioDB){
			return res.status(400).json({
				ok: false,
				err: {
					message: '(Usuario) o contraseña incorrecta'
				}
			});
		}
		//si el password no es correcto
		if (!bcrypt.compareSync( body.password, usuarioDB.password)){

				return res.status(400).json({
					ok: false,
					err: {
						message: 'Usuario o contraseña incorrecta'
					}
				});
		}

		//generando token
		let webtoken = jwt.sign({
			usuario: usuarioDB
		}, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN})

		//si logueo correctamente
		res.json({
			ok: true,
			usuario: usuarioDB,
			token: webtoken
		});

	});
});


module.exports = app;