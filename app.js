var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded(); 
var router = require("./router/router.js");
var session = require('express-session');

//模板引擎

// app.set("view engine","ejs");
//使用session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie:{maxAge:60000}
}));

//静态

app.use(express.static("./public"));
app.use("/avatar",express.static("./avatar"));//引入头像文件加
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({limit:'50mb',extended:true}));
//显示登录信息
app.get("/index",router.showIndex);
//分页
app.get("/page",router.showPage);
//留言列表

app.get("/get/message",router.showMessage);
//添加留言
app.post("/add/message", router.addMessage);
//删除
app.get("/delete", router.showDelete);
//登录
app.post("/login", router.showLogin);
//注册
app.post("/regist", router.showRegist);
//上传头像
app.post("/dosetavatar",urlencodedParser, router.dosetavatar);


app.listen(3000);