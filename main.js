var express = require('express');
var app = express();
var swig = require('swig');

app.set('port', 8080);

app.use(express.static('public'));

require("./routes.js")(app, swig);


// lanzar el servidor
app.listen(app.get('port'), function() {
    console.log("Servidor activo");
});
