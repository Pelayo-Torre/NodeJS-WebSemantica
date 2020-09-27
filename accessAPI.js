const fetch = require('node-fetch');
const wikidataUrl = 'https://query.wikidata.org/sparql';

exports.obtainPictures = function(funcionCallback) {
    let url = wikidataUrl + '?query=' + encodeURIComponent( pinturasNicanor );
    let headers = { 'Accept': 'application/sparql-results+json' };
    //LLAMADA A WIKIDATA
    let json = undefined
    fetch( url, { headers } ).then( body => {
        json = body.json()
        getPictures(json, funcionCallback);
    } );
}

exports.obtainMuseumsByMaterialsAndAuthors = function(funcionCallback) {
    let url = wikidataUrl + '?query=' + encodeURIComponent( museumsByMaterialsAndAuthors );
    let headers = { 'Accept': 'application/sparql-results+json' };
    //LLAMADA A WIKIDATA
    let json = undefined
    fetch( url, { headers } ).then( body => {
        json = body.json()
        getMuseumsByMaterialsAndAuthors(json, funcionCallback);
    } );
}

exports.obtainPicturesByDates = function(funcionCallback) {
    let url = wikidataUrl + '?query=' + encodeURIComponent( picturesByDates );
    let headers = { 'Accept': 'application/sparql-results+json' };
    //LLAMADA A WIKIDATA
    let json = undefined
    fetch( url, { headers } ).then( body => {
        json = body.json()
        getPicturesByDates(json, funcionCallback);
    } );
}

exports.obtainNewMuseums = function (functionCallBack) {
    let url = wikidataUrl + '?query=' + encodeURIComponent( newMuseums );
    let headers = { 'Accept': 'application/sparql-results+json' };
    //LLAMADA A WIKIDATA
    let json = undefined
    fetch( url, { headers } ).then( body => {
        json = body.json()
        getNewMuseums(json, functionCallBack);
    } );
}

exports.obtainPicturesByMaterialsAndAuthors = function (functionCallBack) {
    let url = wikidataUrl + '?query=' + encodeURIComponent( picturesByMaterialsAndAuthors );
    let headers = { 'Accept': 'application/sparql-results+json' };
    //LLAMADA A WIKIDATA
    let json = undefined
    fetch( url, { headers } ).then( body => {
        json = body.json()
        getPicturesByMaterialsAndAuthors(json, functionCallBack);
    } );
}

//CONSULTAS SPARQL -- WIKIDATA
const pinturasNicanor = `SELECT DISTINCT (?painting AS ?picture) (?paintingLabel AS ?pictureName) ?inception ?museum ?museumOfficialWebsite
WHERE 
{
  ?painting wdt:P31 wd:Q3305213 ;
            wdt:P170 wd:Q4891703 ;
            wdt:P571 ?inception ;
            wdt:P276 ?location .
  
  ?location rdfs:label ?museum ;
            wdt:P856 ?museumOfficialWebsite .
 
  FILTER (Lang(?museum)="en") .
  
  SERVICE wikibase:label { 
                          bd:serviceParam wikibase:language "[AUTO_LANGUAGE], en". 
                          ?painting rdfs:label ?paintingLabel.
                         }
}`;

const museumsByMaterialsAndAuthors = `SELECT DISTINCT ?museum ?museumLabel (COUNT(?painting) AS ?numPaintings)
WHERE {
   ?painting wdt:P31 wd:Q3305213 ;
            wdt:P186 ?materials ;
            wdt:P170 ?authors ;
            wdt:P276 ?museum .
  
    FILTER(?authors IN (wd:Q5593, wd:Q4891703, wd:Q13146993, wd:Q5913579))
    FILTER(?materials IN (wd:Q296955, wd:Q12321255, wd:Q14934005, wd:Q287)) 
  
    {
        SELECT DISTINCT ?museum
        WHERE {
            ?museum wdt:P17 wd:Q29 . 
        }  
    }
  
    SERVICE wikibase:label { 
                          bd:serviceParam wikibase:language "[AUTO_LANGUAGE], en". 
                          ?museum rdfs:label ?museumLabel.
                         }
}
GROUP BY ?museum ?museumLabel
ORDER BY ASC (?museumLabel)`

const picturesByDates = `SELECT DISTINCT (?creatorLabel AS ?creatorName) (COUNT(?painting) AS ?numPaintings)
WHERE {
   ?painting wdt:P31 wd:Q3305213 ;
             wdt:P170 ?creator;
             wdt:P571 ?inception .
    
    FILTER(?inception > "1985-01-01"^^xsd:dateTime && ?inception < "1990-01-01"^^xsd:dateTime)
  
    {
        SELECT DISTINCT ?creator
        WHERE {
            ?creator wdt:P27 wd:Q29 . 
        }  
    }
  
  SERVICE wikibase:label { 
                            bd:serviceParam wikibase:language "[AUTO_LANGUAGE], en". 
                            ?creator rdfs:label ?creatorLabel.
                         }
}
GROUP BY (?creatorLabel)
ORDER BY ASC (?creatorLabel)`

const newMuseums = `SELECT DISTINCT ?museum ?museumLabel ?museumDescription ?locationLabel ?coordinates ?streetAddress ?postalCode ?phoneNumber ?faxNumber ?email ?website ?dedicatedToLabel ?fee
WHERE {
   ?museum wdt:P31 wd:Q18411786, wd:Q33506 ;
           wdt:P17 wd:Q29 ;
           wdt:P276 ?location ;
           wdt:P625 ?coordinates .
    
   OPTIONAL{ ?museum wdt:P6375 ?streetAddress }
   OPTIONAL{ ?museum wdt:P281 ?postalCode }
   OPTIONAL{ ?museum wdt:P1329 ?phoneNumber }
   OPTIONAL{ ?museum wdt:P2900 ?faxNumber }
   OPTIONAL{ ?museum wdt:P968 ?email }
   OPTIONAL{ ?museum wdt:P856 ?website }
   OPTIONAL{ ?museum wdt:P825 ?dedicatedTo }
   OPTIONAL{ ?museum wdt:P2555 ?fee }
  
  
  
   SERVICE wikibase:label { 
                          bd:serviceParam wikibase:language "[AUTO_LANGUAGE], en". 
                          ?museum rdfs:label ?museumLabel.
                          ?museum schema:description ?museumDescription .
                          ?location rdfs:label ?locationLabel.
                          ?dedicatedTo rdfs:label ?dedicatedToLabel.
                         }
}
ORDER BY DESC (?museumLabel)`

const picturesByMaterialsAndAuthors = `SELECT DISTINCT ?painting ?paintingLabel ?paintingDescription ?inception ?museumLabel ?authorLabel ?width ?height ?url ?inventoryNumber ?genreLabel
WHERE {
   ?painting wdt:P31 wd:Q3305213 ;
             wdt:P571 ?inception ;
             wdt:P276 ?museum ;
             wdt:P170 ?author ;
             wdt:P186 ?materials ;
             wdt:P2049 ?width ;
             wdt:P2048 ?height ;
   
   FILTER (!REGEX(?paintingLabel, "^Q[0-9]+$"))
   FILTER(?inception > "1865-01-01"^^xsd:dateTime && ?inception < "1970-01-01"^^xsd:dateTime)
   FILTER(?author IN (wd:Q5593, wd:Q4891703, wd:Q13146993, wd:Q5913579))
   FILTER(?materials IN (wd:Q296955, wd:Q12321255, wd:Q14934005, wd:Q287)) 
    
   OPTIONAL{ ?painting wdt:P973 ?url }
   OPTIONAL{ ?painting wdt:P217 ?inventoryNumber }
   OPTIONAL{ ?painting wdt:P136 ?genre }
  
    {
        SELECT DISTINCT ?museum
        WHERE {
            ?museum wdt:P31 wd:Q33506. 
        }  
    }
  
   SERVICE wikibase:label { 
                          bd:serviceParam wikibase:language "[AUTO_LANGUAGE], en". 
                          ?painting rdfs:label ?paintingLabel.
                          ?painting schema:description ?paintingDescription .
                          ?museum rdfs:label ?museumLabel.
                          ?author rdfs:label ?authorLabel.
                          ?genre rdfs:label ?genreLabel.
                         }
}
ORDER BY ASC (?paintingLabel)`


//PARSEA EL JSON Y DEVUELVE UNA LISTA CON LOS CUADROS
getPictures = function(data, functionCallback){
    let pictures = [];
    data.then(function(result) {
        for(let i in result.results.bindings){
            let picture = {
                inception : new Date(result.results.bindings[i].inception.value).getFullYear(),
                url : result.results.bindings[i].picture.value,
                name : result.results.bindings[i].pictureName.value,
                museum: result.results.bindings[i].museum.value
            }
            pictures.push(picture)
        }
        functionCallback(pictures);
    })
}

getMuseumsByMaterialsAndAuthors = function (data, functionCallback) {
    let museums = [];
    data.then(function(result) {
        for(let i in result.results.bindings){
            let museum = {
                museumLabel : result.results.bindings[i].museumLabel.value,
                url : result.results.bindings[i].museum.value,
                numPaintings : result.results.bindings[i].numPaintings.value
            }
            museums.push(museum)
        }
        functionCallback(museums);
    })
}

getPicturesByDates = function (data, functionCallback) {
    let pictures = [];
    data.then(function(result) {
        for(let i in result.results.bindings){
            let picture = {
                creatorName : result.results.bindings[i].creatorName.value,
                numPaintings : result.results.bindings[i].numPaintings.value
            }
            pictures.push(picture)
        }
        functionCallback(pictures);
    })
}

getNewMuseums = function (data, functionCallback) {
    let museums = [];
    data.then(function(result) {
        for(let i in result.results.bindings){
            let address = ""
            let fax = ""
            let dedicated = ""
            let feee = ""
            if(result.results.bindings[i].streetAddress != undefined){
                address = result.results.bindings[i].streetAddress.value
            }
            if(result.results.bindings[i].faxNumber != undefined){
                fax = result.results.bindings[i].faxNumber.value
            }
            if(result.results.bindings[i].dedicatedToLabel != undefined){
                dedicated = result.results.bindings[i].dedicatedToLabel.value
            }
            if(result.results.bindings[i].fee != undefined){
                feee = result.results.bindings[i].fee.value
            }

            let coordinates = result.results.bindings[i].coordinates.value.replace("Point(", "")
            let corr = coordinates.replace(")", "").split(" ")
            let lat = corr[0]
            let lon = corr [1]

            let museum = {
                museumLabel : result.results.bindings[i].museumLabel.value,
                url : result.results.bindings[i].museum.value,
                museumDescription : result.results.bindings[i].museumDescription.value,
                locationLabel : result.results.bindings[i].locationLabel.value,
                latitud : lat,
                longitud : lon,
                streetAddress : address,
                postalCode : result.results.bindings[i].postalCode.value,
                phoneNumber : result.results.bindings[i].phoneNumber.value,
                faxNumber : fax,
                email : result.results.bindings[i].email.value,
                website : result.results.bindings[i].website.value,
                dedicatedToLabel : dedicated,
                fee : feee
            }

            museum.phoneNumber = museum.phoneNumber.replace("-", "");
            museum.phoneNumber = museum.phoneNumber.replace("-", "");
            museum.phoneNumber = museum.phoneNumber.replace("-", "");
            museum.phoneNumber = museum.phoneNumber.replace("-", "");
            museum.faxNumber = museum.faxNumber.replace("-", "");
            museum.faxNumber = museum.faxNumber.replace("-", "");
            museum.faxNumber = museum.faxNumber.replace("-", "");
            museum.faxNumber = museum.faxNumber.replace("-", "");
            museum.email = museum.email.replace("mailto:", "");

            museums.push(museum)
        }
        functionCallback(museums);
    })
}

getPicturesByMaterialsAndAuthors = function (data, functionCallback) {
    let pictures = [];
    data.then(function(result) {
        for(let i in result.results.bindings){
            let uri = ""
            if(result.results.bindings[i].url != undefined){
                uri = result.results.bindings[i].url.value
            }
            let picture = {
                painting : result.results.bindings[i].painting.value,
                paintingLabel : result.results.bindings[i].paintingLabel.value,
                paintingDescription : result.results.bindings[i].paintingDescription.value,
                inception : new Date(result.results.bindings[i].inception.value).getFullYear(),
                museumLabel : result.results.bindings[i].museumLabel.value,
                authorLabel : result.results.bindings[i].authorLabel.value,
                width : result.results.bindings[i].width.value,
                height : result.results.bindings[i].height.value,
                url : uri
            }
            pictures.push(picture)
        }
        functionCallback(pictures);
    })
}