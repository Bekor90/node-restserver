const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');

app.get('/productos', verificaToken, (req, res) => {

	let desde = req.query.desde || 0;
	desde = Number(desde);

	let limite = req.query.limite || 5;
	limite = Number(limite);

	
    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

			if(err) {
				return res.status(500).json({
					ok:false,
					err
				});
			}

			res.json({
				ok: true,
				productos
			});
			
		});

});

app.get('/producto/:id', verificaToken, (req, res) => {

	 let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'el ID del producto no existe'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });

        });

});

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

	let termino = req.params.termino;

	let regex = new RegExp(termino, 'i');

	Producto.find({ nombre: regex })	   
        .populate('categoria', 'nombre')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

        	res.json({
        		ok:true,
        		productos
        	});

        });
});

app.post('/producto', verificaToken, (req, res) => {

	let body = req.body;

	let producto = new Producto ({
		 usuario: req.usuario._id,
		nombre: body.nombre,
		precioUni: body.precioUni,
		descripcion: body.descripcion,
		diponible: body.diponible,
		categoria: body.categoria		
	});

	producto.save( (err, productoDB) => {

		if(err) {
			return res.status(500).json({
				ok:false,
				err
			});
		}

		if(!productoDB){
			return res.status(400).json({
				ok:false,
				err
			});
		}

		res.json({
			ok: true,
			producto: productoDB
		});

	});

});

app.put('/producto/:id', verificaToken, (req, res) => {

	let id = req.params.id;
	let body = req.body;

	//otra forma de actualizar
	Producto.findById(id, (err, productoDB) => {

		if (err) {
			return res.status(500).json({
				ok: false,
				err

			});
		}
		if (!productoDB) {
			return res.status(400).json({
				ok:false,
				err:{
					message: 'El ID del producto no existe'
				}
			});
		}

		productoDB.nombre = body.nombre;
		productoDB.precioUni = body.precioUni;
		productoDB.categoria = body.categoria;
		productoDB.diponible = body.diponible;
		productoDB.descripcion = body.descripcion;

		productoDB.save( (err, productoAlmacenado) => {
			if (err) {
				return res.status(500).json({
					ok: false,
					err

				});
			}

			res.json({
				ok: true,
				producto: productoAlmacenado
			});

		});


	});


});

app.delete('/producto/:id', (req, res) => {

	let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {

    	if (err) {
			return res.status(500).json({
				ok: false,
				err

			});
		}
		if (!productoDB) {
			return res.status(400).json({
				ok:false,
				err:{
					message: 'El ID del producto no existe'
				}
			});
		}

		productoDB.disponible = false;

		productoDB.save( (err, productoEliminado) => {
			if (err) {
				return res.status(500).json({
					ok: false,
					err

				});
			}

			res.json({
				ok: true,
				producto: productoEliminado,
				mensaje: 'Producto eliminado'
			});

		});		

    });

});

module.exports = app;