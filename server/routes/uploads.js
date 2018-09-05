const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {

	let tipo = req.params.tipo;
	let id = req.params.id;

	if (!req.files){
	    return res.status(400)
			.json({
				ok: false,
				err:{
					message: 'No se seleccionó ningún archivo'
				}
			});
	}

	//nombres de carpetas permitidas en la url para almacenar
	let tiposValidos = ['productos', 'usuarios'];

	if (tiposValidos.indexOf(tipo) < 0) {

		return res.status(400).json({
			ok: false,
			err: {
				message: 'Los tipos permitidos son: '+ tiposValidos.join(', ')					
			}
		});
	}

	let archivo = req.files.archivo;
	let nombreArchivoseparado = archivo.name.split('.');
	let extension = nombreArchivoseparado[nombreArchivoseparado.length - 1];

	//console.log(extension);

	//extensiones permitidas
	let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

	if (extensionesValidas.indexOf(extension) < 0) {
		return res.status(400).json({
			ok: false,
			err: {
				message: 'La extensiones permitidas son: '+ extensionesValidas.join(', '),
				ext: 'Se encuentra intentando cargar un archivo .' + extension
			}
		});
	}

	//cambiar nombre al archivo
	let id_unico_archivo=Math.random().toString(36).substr(2, 9);
    let nuevo_archivo=`${id}-${id_unico_archivo}.${extension}`;

	 archivo.mv(`uploads/${ tipo }/${ nuevo_archivo }`, (err) => {

	    if (err)
	      return res.status(500).json({
	      	ok: false,
	      	err
	      });

	  if (tipo == 'usuarios'){
	  	imagenUsuario(id, res, nuevo_archivo);	
	  }else{	  	
	  	imagenProducto(id, res, nuevo_archivo);	
	  }
	 
  	});

});

function imagenUsuario(id, res, nuevo_archivo){

	Usuario.findById(id, (err, usuarioDB) =>{

		 if (err){

		  eliminarImagen(nuevo_archivo, 'usuarios');
	      return res.status(500).json({
	      	ok: false,
	      	err
	      });
		}

		if (!usuarioDB) {

			eliminarImagen(nuevo_archivo, 'usuarios');
			return res.status(500).json({
		      	ok: false,
		      	err:{
		      		message: 'El usuario no existe'
		      	}
		    });
		}

		//eliminar imagen
		eliminarImagen(usuarioDB.img, 'usuarios');

		usuarioDB.img = nuevo_archivo;

		usuarioDB.save( (err, usuarioAlmacenado) => {

			res.json({
				ok: true,
				usuario: usuarioAlmacenado
			});

		});


	});
}

function imagenProducto(id, res, nuevo_archivo){

	Producto.findById(id, (err, productoDB) => {

		 if (err){

		  eliminarImagen(nuevo_archivo, 'productos');
	      return res.status(500).json({
	      	ok: false,
	      	err
	      });
		}

		if (!productoDB) {

			eliminarImagen(nuevo_archivo, 'productos');
			return res.status(500).json({
		      	ok: false,
		      	err:{
		      		message: 'El producto no existe'
		      	}
		    });
		}

		//eliminar imagen
		eliminarImagen(productoDB.img, 'productos');

		productoDB.img = nuevo_archivo;

		productoDB.save( (err, productoAlmacenado) => {

			res.json({
				ok: true,
				producto: productoAlmacenado
			});

		});

	});

}

function eliminarImagen(nombreImagen, carpeta){

	let pathImagen = path.resolve(__dirname, `../../uploads/${ carpeta }/${ nombreImagen }`);

		if (fs.existsSync(pathImagen)){
			fs.unlinkSync(pathImagen);
		}
}

module.exports = app;