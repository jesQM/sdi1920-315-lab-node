module.exports = function(app, swig, gestorBD) {

    app.get("/comentario/borrar/:id",function (req,res) {
        let criterio = {
            _id : gestorBD.mongo.ObjectID(req.params.id),
        }

        if (typeof req.session.usuario == "undefined" || req.session.usuario == null){
            res.send("Usuario no en sesión");
        } else {
            gestorBD.listarComentarios(criterio, function (comments) {
                if (!comments || !comments[0]) { // comments == null ||comments[0] == null
                    res.send("Comentario no encontrado");
                } else {
                    let comment = comments[0];
                    if (comment.autor != req.session.usuario) {
                        res.send("Usuario erroneo");
                    } else {
                        gestorBD.borrarComentario(criterio, function (result) {
                            if (result) {
                                res.send("Comentario suprimido");
                            } else {
                                res.send("Error");
                            }
                        });
                    }
                }
            });
        }

    });

    app.post("/comentarios/:cancion_id", function(req, res){
        let comment = {
            autor : req.session.usuario,
            texto : req.body.texto,
            cancion_id : gestorBD.mongo.ObjectID(req.params.cancion_id),
        }

        if (typeof comment.autor == "undefined" || comment.autor == null){
            res.send("Usuario no en sesión");
        } else {
            gestorBD.insertarComentario(comment, function (result) {
                if (result) {
                    res.send("Agregado id: "+ result);
                } else {
                    res.send("Error");
                }
            });
        }
    });
}