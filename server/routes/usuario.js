const express = require('express');

const bcrypt = require('bcrypt');

const _ = require('underscore');

const Usuario = require('../models/usuario');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const app = express();

//busca usuarios
app.get('/usuario', verificaToken, (req, res) => {

	return res.json({
		usuario: req.usuario,
		nombre: req.usuario.nombre,
		email: req.usuario.email
		
		})

	let desde = req.query.desde || 0;

	desde = Number(desde);

	let limite = req.query.limite || 5;

	limite = Number(limite);

	 //find( {}, '')  primer argumento permite filtrar la consulta, segundo argumento campos a mostrar de consulta
	 //find( {}) sino se van a especificar campos a mostrar

	Usuario.find( {})
			.skip(desde)
			.limit(limite)
			.exec( (err, usuarios) => {

				if(err){
					return res.status(400).json({
						ok: false,
						err
					});
				}

				Usuario.count({}, (err, conteo) => {

					res.json({
						ok: true,
						usuarios,
						cuantos: conteo
					});

				});

				
			})
	
});

//registra un usuario
app.post('/usuario', [verificaToken, verificaAdmin_Role], (req, res) => {

	let body = req.body;

	let usuario = new Usuario({
		nombre: body.nombre,
		email: body.email,
		password: bcrypt.hashSync(body.password, 10),
		role: body.role
	});

	usuario.save( (err, usuarioDB) => {
			if(err){
				return res.status(400).json({
					ok: false,
					err
				});
			}

			usuarioDB.password = null;

			res.json({
				ok: true,
				usuario: usuarioDB
			});
	});

});

//actualiza un usuario
app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

	let id = req.params.id;
	let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

	Usuario.findById( id, body, { new: true, runValidators: true}, (err, usuarioDB) => {

		if(err){

			return res.status(400).json({
				ok: false,
				err
			});			
		}

		res.json({

			ok: true,
			usuario: usuarioDB				
		});

	});

	
});

app.delete('/usuario/id', [verificaToken, verificaAdmin_Role], (req, res) => {
	
	let id = req.params.id;

	let nuevoEstado = {
		estado: false
	};

	//Usuario.findByIdAndRemove(id, (err, usuarioEliminado) =>{ eliminar registro de la BD

	//Cambiar estado del usuario
	Usuario.findByIdAndUpdate(id, nuevoEstado, { new: true}, (err, usuarioEliminado) =>{

		if(err){

			return res.status(400).json({
				ok: false,
				err
			});			
		}

		if(!usuarioEliminado){
			return res.status(400).json({
				ok: false,
				err: {
					message: 'Usuario no encontrado'
				}
			});		
		}

		res.json({
			ok: true,
			usuario: usuarioEliminado
		});

	})


});

module.exports = app;