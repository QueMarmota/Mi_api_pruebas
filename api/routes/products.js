const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');




const Product = require('../models/product');


router.get('/', (req, res, next) => {
    Product.find()
        .select()
        .exec()
        .then(docs => {
            const response = {//aqui le damos estructura a los datos que nos va regresar
                count: docs.length,
                //aqui mapeamos los productos 
                products: docs.map(doc => {
                    return {
                        nombre: doc.nombre,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            //url de nuestro serv
                            url: 'https://lit-lowlands-57737.herokuapp.com/products/' + doc._id
                        }
                    };
                })
            };
            //El codigo dle if es para si no existen datos
            // if (docs.length >= 0) {
            res.status(200).json(response);
            // }else{
            //     res.status(404).json({
            //         message:'No hay datos'
            //     });
            // }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select()
        .exec()
        .then(doc => {
            console.log('Desde la base de datos ', doc);//si todo salio bn
            if (doc)//si el id existe
            {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        description: 'Get Product by id',
                        url: 'https://lit-lowlands-57737.herokuapp.com/products/' + doc._id
                    }
                });
            } else {
                res.status(404).json({ message: 'No existe el ID' });
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err });
        });
});

router.post('/', (req, res, next) => {
    //condicion para asegurarnos de insertar id de Usuario que existe
    console.log(req.file)
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        nombre: req.body.nombre == undefined ? Usuario.nombre : req.body.nombre,

    });
    return product.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Product creado',
                productCreado: {
                    _id: result._id,

                },
                request: {
                    type: 'GET',
                    url: 'https://lit-lowlands-57737.herokuapp.com/products/' + result._id
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
});

router.put('/:productsId', (req, res, next) => {
    const id = req.params.product;
    Product.findById(id)//buscamos al product actual al cual se le haran las modificaciones
        .select()
        .exec()
        .then(doc => {
            // console.log('From database', doc);//si todo salio bn
            if (doc)//si el id existe
            {
                Product.update({ _id: id }, {
                    $set: {
                        nombre: req.body.nombre != undefined ? req.body.nombre : doc.nombre,

                    }
                })
                    .exec()
                    .then(result => {
                        res.status(200).json({
                            message: 'Product actualizado',
                            request: {
                                type: 'GET',
                                url: 'https://lit-lowlands-57737.herokuapp.com/products/' + id
                            }
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        err.status(500).json({
                            error: err
                        });
                    });
            }//if si el id existe
            else {
                res.status(500).json({
                    message: 'El ID no existe'
                });
            }
        })
        .catch(err => {
            console.log(err);
            err.status(500).json({
                error: err
            });
        });
});

router.delete('/:productId', (req, res, next) => {
    Product.remove({ _id: req.params.productId }).exec()
        .then(result => {
            res.status(200).json({
                message: 'Product borrado'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

module.exports = router;

