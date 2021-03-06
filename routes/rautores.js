module.exports = function(app, swig) {
    app.get("/autores", function(req, res){
        let autores = [{
            "nombre" : "Ludwig van Beethoven",
            "grupo" : "Bonn",
            "rol" : "batería",
        }, {
            "nombre" : "Shōji Meguro",
            "grupo" : "Catherine",
            "rol" : "guitarrista",
        }, {
            "nombre" : "Mark 'TDK' Knight",
            "grupo" : "FlitKillsMoths",
            "rol" : "guitarrista",
        }];

        let respuesta = swig.renderFile("views/autores.html", {
            vendedor : "Autores",
            autores : autores,
        });

        res.send( respuesta );
    });

    app.get("/autores/agregar", function(req, res){
        let options = [{
            "value" : "cantante",
            "text" : "cantante",
        }, {
            "value" : "bateria",
            "text" : "batería",
        }, {
            "value" : "guitarrista",
            "text" : "guitarrista",
        }, {
            "value" : "bajista",
            "text" : "bajista",
        }, {
            "value" : "teclista",
            "text" : "teclista",
        }];

        let respuesta = swig.renderFile("views/autores-agregar.html", {
            options : options
        });
        res.send( respuesta );
    });

    app.post("/autores/agregar", function(req, res){
        let nombre = req.body.nombre;
        if (nombre === undefined || nombre == null)
            nombre = "no enviado en la petición";

        let grupo = req.body.grupo;
        if (grupo === undefined || grupo == null)
            grupo = "no enviado en la petición";


        let respuesta = "Nombre: " + nombre + "<br>"
                        + "Grupo: " + grupo + "<br>"
                        + "Rol: " + req.body.rol;
        res.send( respuesta );
    });

    app.get("/autores/filtrar/:rol", function(req, res){
        let autores = [{
            "nombre" : "Ludwig van Beethoven",
            "grupo" : "Bonn",
            "rol" : "batería",
        }, {
            "nombre" : "Shōji Meguro",
            "grupo" : "Catherine",
            "rol" : "guitarrista",
        }, {
            "nombre" : "Mark 'TDK' Knight",
            "grupo" : "FlitKillsMoths",
            "rol" : "guitarrista",
        }];

        autores = autores.filter( (autor) => autor.rol == req.params.rol )
        let respuesta = swig.renderFile("views/autores.html", {
            vendedor : "Autores",
            autores : autores,
        });

        res.send( respuesta );
    });

    app.get("/autores/*", function(req, res){
        res.redirect( "/autores" );
    });
}