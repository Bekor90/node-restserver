const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
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


//configuraciones de google

async function verify() {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();

  return{
  	nombre: payload.name,
  	email: payload.email,
  	img: payload.picture,
  	google: true
  }
  
}

app.post('/google', async (req, res) => {

	let token = req.body.idtoken;

	let googleUser = await verify(token)
							.catch( e => {
								return res.status(403).json({
									ok: false,
									err: e
								});
							});

	//Buscar el correo de google en la BD
	Usuario.findOne( {email: googleUser.email }, (err, usuarioDB) => {
		if (err) {
			return res.status(500).json({
				ok:false,
				err
			});
		};

//Validar si el usuario usado por el google sign ya se encuentra en la BD, si se encuentra debe loguearse de forma normal
		if (usuarioDB) {
			if (usuarioDB.google === false) {
				return res.status(400).json({
					ok:false,
					err: {
						message: 'Debe de usar su autenticacion normal'
					}
				});

			}else{
				let token = jwt.sign({
					usuario.usuarioDB
				}, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

				return res.json({
					ok:true,
					usuario: usuarioDB,
					token
				});
			}
			//Si el usuario no existe en la BD
		}else{

			let usuario = new Usuario();

			usuario.nombre = googleUser.nombre;
			usuario.email = googleUser.email;
			usuario.img = googleUser.img;
			usuario.google = googleUser.nombre;
			usuario.password = ':)';

			usuario.save( (err, usuarioDB) => {
				if (err) {
					return res.status(500).json({
						ok:false,
						err
					});
				};

				let token = jwt.sign({
					usuario.usuarioDB
				}, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

				return res.json({
					ok:true,
					usuario: usuarioDB,
					token
				});

			});
		}
	});						

});



module.exports = app;

///CONFIGURAR VARIABLES DEL SERVIDOR CON HEROKU

//https://johnvanegas-restserver-node.herokuapp.com/