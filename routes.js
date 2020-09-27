const api = require("./accessAPI")

module.exports = function(app, swig) {

    app.get("/", function(req, res) {
        var respuesta = swig.renderFile('views/index.html');
        res.send(respuesta);
    });

    app.get("/nicanor", function(req, res) {

        api.obtainPictures(function (pictures) {
            if(pictures == null){
                res.send("ERROR AL OBTENER CUADROS")
            }
            else{
                var respuesta = swig.renderFile('views/nicanor.html',
                    {
                        pictures : pictures
                    });
                res.send(respuesta);
            }
        })
    });

    app.get("/museumsMA", function(req, res) {

        api.obtainMuseumsByMaterialsAndAuthors(function (museums) {
            if(museums == null){
                res.send("ERROR AL OBTENER LOS MUSEOS")
            }
            else{
                var respuesta = swig.renderFile('views/museosByMatAndAut.html',
                    {
                        museums : museums
                    });
                res.send(respuesta);
            }
        })
    });

    app.get("/picturesByDate", function(req, res) {
        api.obtainPicturesByDates(function (pictures) {
            if(pictures == null){
                res.send("ERROR AL OBTENER LOS CUADROS")
            }
            else{
                var respuesta = swig.renderFile('views/cuadrosDate.html',
                    {
                        pictures : pictures
                    });
                res.send(respuesta);
            }
        })
    });

    app.get("/newMuseums", function(req, res) {
        api.obtainNewMuseums(function (museums) {
            if(museums == null){
                res.send("ERROR AL OBTENER LOS MUSEOS")
            }
            else{
                let respuesta = swig.renderFile('views/newMuseums.html',
                    {
                        museums : museums
                    });
                res.send(respuesta);
            }
        })
    });

    app.get("/picturesMA", function(req, res) {
        api.obtainPicturesByMaterialsAndAuthors(function (pictures) {
            if(pictures == null){
                res.send("ERROR AL OBTENER LOS CUADROS")
            }
            else{
                let respuesta = swig.renderFile('views/picturesByMatAndAut.html',
                    {
                        pictures : pictures
                    });
                res.send(respuesta);
            }
        })
    });

};






