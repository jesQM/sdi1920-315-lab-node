let express = require("express");
let app = express();

let mongo = require('mongodb');
let swig = require('swig');
let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let gestorBD = require("./modules/gestorBD.js");
gestorBD.init(app,mongo);
let fileUpload = require('express-fileupload');
app.use(fileUpload());

app.use(express.static('public'));
app.set('port', 8081);
app.set('db','mongodb://admin:sdi_Iz9@tiendamusica-shard-00-00-xmbgc.mongodb.net:27017,tiendamusica-shard-00-01-xmbgc.mongodb.net:27017,tiendamusica-shard-00-02-xmbgc.mongodb.net:27017/test?ssl=true&replicaSet=tiendamusica-shard-0&authSource=admin&retryWrites=true&w=majority');

require("./routes/rusuarios.js")(app, swig, gestorBD);
require("./routes/rcanciones.js")(app, swig, gestorBD);
require("./routes/rautores.js")(app, swig);

app.get('/promo*', function (req, res) {
    res.send('Respuesta patrón promo* ');
})

app.listen(app.get('port'), function () {
    console.log("server online");
});

