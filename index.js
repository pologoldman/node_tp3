var express = require('express');
var app = express();
var port = 3000;
var unzip = require('unzip-stream');

app.get('/tp3', function (req, res) {
    var telechargement = require('download');
    var fs = require('fs');
    var csv = require('csv-parser');
    var total_bloc = 0;
    var resultat = 0;
    telechargement('https://files.data.gouv.fr/insee-sirene/StockEtablissementLiensSuccession_utf8.zip', 'data').then(function () {
        fs.createReadStream('data/StockEtablissementLiensSuccession_utf8.zip')
            .pipe(unzip.Parse())
            .on('entry', function (entry) {
            var file = entry.path;
            if (file === "StockEtablissementLiensSuccession_utf8.csv") {
                entry.pipe(csv())
                    .on('data', function (data) { 
                        total_bloc = total_bloc + 1 ; 
                        if (data.transfertSiege == 'true'){
                            resultat = resultat + 1;
                        } 
                     })

                    .on('end', function () {
                    var percent = resultat / total_bloc * 100;
                    var resultat_tot = percent.toFixed(1);

                    res.send("Environ ".concat(resultat_tot, "% des compagnies ont transféré leurs sièges social"));
                });
            }
            else {
                entry.autodrain();
            }
        });
    });
});

app.listen(port, function () { return console.log("Le rendu du TP est sur localhost:".concat(port, "/tp3")); });
