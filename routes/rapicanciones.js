module.exports = function(app, gestorBD) {

    app.get("/api/cancion", function(req, res) {
        gestorBD.obtenerCanciones( {} , function(canciones) {
            if (canciones == null) {
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send( JSON.stringify(canciones) );
            }
        });
    });

    app.get("/api/cancion/:id", function(req, res) {
        var criterio = { "_id" : gestorBD.mongo.ObjectID(req.params.id)}

        gestorBD.obtenerCanciones(criterio,function(canciones){
            if ( canciones == null ){
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send( JSON.stringify(canciones[0]) );
            }
        });
    });

    app.delete("/api/cancion/:id", function(req, res) {
        var criterio = {
            "_id" : gestorBD.mongo.ObjectID(req.params.id)
        }

        gestorBD.obtenerCanciones(criterio, function (canciones) {
            if ( canciones == null ){
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            } else {
                if ( canciones[0].autor == res.usuario ) {
                    gestorBD.eliminarCancion(criterio,function(canciones){
                        if ( canciones == null ){
                            res.status(500);
                            res.json({
                                error : "se ha producido un error"
                            })
                        } else {
                            res.status(200);
                            res.send( JSON.stringify(canciones) );
                        }
                    });
                } else {
                    res.status(403);
                    res.json({
                        error : "no eres el propietario de la canción"
                    })
                }
            }
        });
    });

    app.post("/api/cancion", function(req, res) {
        var cancion = {
            nombre : req.body.nombre,
            genero : req.body.genero,
            precio : req.body.precio,
            autor : res.usuario,
        }
        // ¿Validar nombre, genero, precio?
        let err = validarCampos(cancion);
        if (!err) {
            gestorBD.insertarCancion(cancion, function(id){
                if (id == null) {
                    res.status(500);
                    res.json({
                        error : "se ha producido un error"
                    })
                } else {
                    res.status(201);
                    res.json({
                        mensaje : "canción insertarda",
                        _id : id
                    })
                }
            });
        } else {
            res.status(400);
            res.json(err)
        }
    });

    function validarCampos(cancion) {
        let msg = [];

        if (!(cancion.nombre === undefined && !cancion.nombre)) {
            if (cancion.nombre.length == 0 || cancion.nombre.length > 10)
                msg.push("nombre, longitud inválida")
        } else
            msg.push("nombre no asignado")


        if (!(cancion.genero === undefined && !cancion.genero)) {
            if (cancion.genero.length == 0 || cancion.genero.length > 10)
                msg.push("genero, longitud inválida")
        } else
            msg.push("genero no asignado")

        if (!(cancion.precio === undefined && !cancion.precio)) {
            if (cancion.precio < 0)
                msg.push("precio inválido")
        } else
            msg.push("precio no asignado")

        if (msg.length > 0)
            return {error : msg};
        else
            return null;
    }

    app.put("/api/cancion/:id", function(req, res) {

        let criterio = { "_id" : gestorBD.mongo.ObjectID(req.params.id) };

        let cancion = {}; // Solo los atributos a modificar
        if ( req.body.nombre != null)
            cancion.nombre = req.body.nombre;
        if ( req.body.genero != null)
            cancion.genero = req.body.genero;
        if ( req.body.precio != null)
            cancion.precio = req.body.precio;

        let err = validarCamposModificar(cancion);

        if (!err) {
            gestorBD.obtenerCanciones(criterio, function (canciones) {
                if (canciones == null) {
                    res.status(500);
                    res.json({
                        error: "se ha producido un error"
                    })
                } else {
                    if ( canciones[0].autor == res.usuario ) {
                        gestorBD.modificarCancion(criterio, cancion, function (result) {
                            if (result == null) {
                                res.status(500);
                                res.json({
                                    error: "se ha producido un error"
                                })
                            } else {
                                res.status(200);
                                res.json({
                                    mensaje: "canción modificada",
                                    _id: req.params.id
                                });
                            }
                        });
                    } else {
                        res.status(403);
                        res.json({
                            error : "no eres el propietario de la canción"
                        })
                    }
                }
            });
        } else {
            res.status(400);
            res.json(err);
        }
    });

    function validarCamposModificar(cancion) {
        let msg = [];

        if (!(cancion.nombre === undefined && !cancion.nombre))
            if (cancion.nombre.length == 0 || cancion.nombre.length > 10)
                msg.push("nombre, longitud inválida")


        if (!(cancion.genero === undefined && !cancion.genero))
            if (cancion.genero.length == 0 || cancion.genero.length > 10)
                msg.push("genero, longitud inválida")

        if (!(cancion.precio === undefined && !cancion.precio))
            if (cancion.precio < 0)
                msg.push("precio inválido")

        if (msg.length > 0)
            return {err : msg};
        else
            return null;
    }

    app.post("/api/autenticar/", function(req, res) {
        var seguro = app.get("crypto")
            .createHmac('sha256', app.get('clave'))
            .update(req.body.password)
            .digest('hex');

        var criterio = {
            email : req.body.email,
            password : seguro
        }

        gestorBD.obtenerUsuarios(criterio, function(usuarios) {
            if (usuarios == null || usuarios.length == 0) {
                res.status(401);
                res.json({
                    autenticado : false
                })
            } else {
                var token = app.get('jwt').sign(
                    {usuario: criterio.email , tiempo: Date.now()/1000},
                    "secreto");
                res.status(200);
                res.json({
                    autenticado: true,
                    token : token
                });
            }

        });
    });

}