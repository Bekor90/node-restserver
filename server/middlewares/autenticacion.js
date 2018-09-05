const jwt = require('jsonwebtoken');


///verifica token ///

let verificaToken = (req, res, next) => {

	//validamos si el token viene por cabecera o por url
	let token = req.query.token ? req.query.token : req.get('token');

	jwt.verify(token, process.env.SEED, (err, decoded) => {

		if(err){
			return res.status(401).json({
				ok:false,
				err:{
					message: 'Token no valido'
				}
			});
		}

		req.usuario = decoded.usuario;

		next();
	});
};


/*/////////////////////////
=== verifica admin rol ===
/////////////////////////*/

let verificaAdmin_Role = (req, res, next) => {

	let usuario = req.usuario;

	if(usuario.role === 'ADMIN_ROLE'){
		next();
	}else{

		return res.json({
			ok:false,
			err: {
				message: 'El usuario no es administrador'
			}
		});
	}
};			

module.exports = {
	verificaToken,
	verificaAdmin_Role,
}