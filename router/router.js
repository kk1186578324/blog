var db = require("../model/db.js");
var md5 = require("../model/md5.js");
// var bodyParser = require('body-parser');
var fs = require('fs');
var ObjectId = require("mongodb").ObjectID;


exports.showIndex = function (req, res, next) {
    console.log(req.session)
    //检索数据库，查找此人的头像
    if (req.session.login == "1") {
        //如果登陆了
        var username = req.session.username;
        var login = true;

    } else {
        //没有登陆
        var username = "";  //制定一个空用户名
        var login = false;
    }
    //已经登陆了，那么就要检索数据库，查登陆这个人的头像
    db.find("user", {"username": username}, function (err, result) {
        console.log(result)
        if (result.length) {
            res.json({
                "success": true,
                "content": result
            });

        }else {
            res.json({
                "success": false
            });
        }
    });


}
//登录
exports.showLogin = function (req, res, next) {
    var param = req.body;
    db.find("user", {"username": param.name, "password": md5(md5(param.password) + "kai")}, function (err, result) {
        if (result.length) {

            req.session.login = "1";
            req.session.username = param.name;
            res.json({
                "success": true,
                "content": result
            });

        } else {
            res.json({
                "success": false
            });
        }
    });
}

//注册
exports.showRegist = function (req, res, next) {
    var param = req.body;
    db.find("user", {"username": param.name}, function (err, result) {
        if (result.length) {
            res.json({
                "success": false
            });
        } else {
            db.insertOne("user", {
                "username": param.name,
                "password": md5(md5(param.password) + "kai"),
                "avatar": "moren.jpg"
            }, function (err, result) {
                if (err) {
                    res.send({"success": false})
                    return;
                }
                res.json({"success": true})

            })

        }


    });


}
// 留言板列表
exports.showPage = function (req, res, next) {
    db.getAllCount("blog", function (count) {
        console.log(count)
        res.send({
            "pageamount": Math.ceil(count / 5)
        });
    })
}


//获取留言内容
exports.showMessage = function (req, res, next) {
    var page = parseInt(req.query.page);
    db.find("blog", {}, {"sort": {"time": -1}, "pageamount": 5, "page": (page - 1)}, function (err, result) {
        if (err) {
            res.send("-1");
        }

        res.json({
            "success": true,
            "content": result
        });

    });


}

//提交留言
exports.addMessage = function (req, res, next) {
    var param = req.body;
    db.insertOne("blog", {
        "name": param.name,
        "title": param.title,
        "time": param.time,
        "look": param.look,
        "content": param.content
    }, function (err, result) {
        if (err) {
            res.send({"success": false})
            return;
        }
        res.json({"success": true})
    })


}

//删除
exports.showDelete = function (req, res, next) {
    //得到参数
    var id = req.query.id;
    db.deleteMany("blog", {"_id": ObjectId(id)}, function (err, result) {
        res.redirect("/views");
    });
}

//上传头像
exports.dosetavatar = function (req, res, next) {

    var base64url = req.body.base64url;
    console.log(req.body.files);
    var imageName = Date.now() + '.jpg';
    var path = __dirname + "/../avatar/"+imageName;//从app.js级开始找--在我的项目工程里是这样的
    console.log(path);
    var base64 = base64url.replace(/^data:image\/\w+;base64,/, "");//去掉图片base64码前面部分data:image/png;base64
    var dataBuffer = new Buffer(base64, 'base64'); //把base64码转成buffer对象，
    console.log(dataBuffer);
//         console.log('dataBuffer是否是Buffer对象：'+Buffer.isBuffer(dataBuffer));
    fs.writeFile(path, dataBuffer, function (err) {//用fs写入文件
        if (err) {
            console.log(err);
        } else {
            console.log('写入成功！');
        }
    })
    //更改数据库当前用户的avatar这个值
    db.updateMany("user", {"username": req.session.username}, {
        $set: {"avatar": imageName}
    }, function (err, results) {
        res.send("1");
    });


}