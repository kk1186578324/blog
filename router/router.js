var db = require("../model/db.js");
var fs = require('fs');
var formidable = require("formidable");
var ObjectId = require("mongodb").ObjectID;

//登录
exports.showLogin = function (req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields) {

        db.find("user", {"username": fields.name,"password":fields.password}, function (err, result) {

            console.log(result);

            if(result.length){
                res.json({
                    "success": true,
                });
            }else {
                res.json({
                    "success": false,
                });
            }


        });

    })

}

//注册
exports.showRegist = function (req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields) {

        db.find("user", {"username": fields.name}, function (err, result) {

            console.log(result);

            if(result.length){
                res.json({
                    "success": false,
                });
            }else {
                db.insertOne("user", {
                    "username": fields.name,
                    "password": fields.password,
                    "avatar":"moren.jpg"
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


//上传头像
exports.dosetavatar = function (req, res, next) {

    //必须保证登陆
    // if (req.session.login != "1") {
    //     res.end("非法闯入，这个页面要求登陆！");
    //     return;
    // }
 var base64url = req.body.base64url;

 console.log(base64url);


    // var form = new formidable.IncomingForm();

    // console.log(form);


var path = __dirname + "/../avatar"+ Date.now() +'.png';//从app.js级开始找--在我的项目工程里是这样的
var base64 = base64url.replace(/^data:image\/\w+;base64,/, "");//去掉图片base64码前面部分data:image/png;base64
var dataBuffer = new Buffer(base64, 'base64'); //把base64码转成buffer对象，

console.log(dataBuffer);
//         console.log('dataBuffer是否是Buffer对象：'+Buffer.isBuffer(dataBuffer));
        fs.writeFile(path,dataBuffer,function(err){//用fs写入文件
            if(err){
                console.log(err);
            }else{
               console.log('写入成功！');
            }
        })


// require('fs').writeFile(‘out.png’,binaryData,’binary’,function(err){
// if(err){
// console.log(err);
// }
// });
// res.send(saved);

    // form.uploadDir = path.normalize(__dirname + "/../avatar");
    // form.parse(req, function (err, fields, files) {
    //     console.log(files);
    //     var oldpath = files.touxiang.path;
    //     var newpath = path.normalize(__dirname + "/../avatar") + "/" + req.session.username + ".jpg";
    //     fs.rename(oldpath, newpath, function (err) {
    //         if (err) {
    //             res.send("失败");
    //             return;
    //         }
    //         req.session.avatar = req.session.username + ".jpg";
    //         //跳转到切的业务
    //         res.redirect("/cut");
    //     });
    // });
}