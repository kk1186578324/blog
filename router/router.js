var db = require("../model/db.js");

var formidable = require("formidable");
var ObjectId = require("mongodb").ObjectID;

exports.showRegist = function (req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields) {

        db.find("user", {"username": fields.name}, function (err, result) {

            console.log(result);

            if(result.length){
                res.json({
                    "success": false
                });
            }else {

                db.insertOne("user", {
                    "username": fields.name,
                    "password": fields.title,
                }, function (err, result) {
                    if (err) {
                        res.send({"success": false})
                        return;
                    }
                    res.json({"success": true})

                })

            }


        });

    })

}