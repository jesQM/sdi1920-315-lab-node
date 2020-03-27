module.exports = function(app, swig, gestorBD) {
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