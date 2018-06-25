var express = require("express");
var app = express();
var db = require("./model/db.js");
var formidable = require("formidable");

var ObjectId = require("mongodb").ObjectID;
//模板引擎

// app.set("view engine","ejs");

//静态

app.use(express.static("./public"));
// 留言板列表
app.get("/page",function(req,res,next){
    db.getAllCount("blog",function(count){
    	console.log(count)
    	res.send({
          "pageamount":Math.ceil(count/6)
    	});
    });

});
//获取留言内容
app.get("/get/message",function(req,res,next){
 var page = parseInt(req.query.page);
 db.find("blog",{},{"sort":{"time":-1},"pageamount":5,"page":page},function(err,result){
    res.json({"success":true,
              "content":result});

 });


})

//提交留言
app.post("/add/message",function(req,res,next){
 var form = new formidable.IncomingForm();
 form.parse(req,function(err,fields){
    db.insertOne("blog",{
    	"name":fields.name,
    	"title":fields.title,
    	"time":fields.time,
    	"look":fields.look,
    	"content":fields.content
    },function(err,result){
       if(err){

       	res.send({"success":false})
       	return;
       }

       res.json({"success":true})

    })
 
 	console.log(fields);
 })
 console.log(form);
 


})

//删除
app.get("/delete",function(req,res,next){
    //得到参数
    var id = req.query.id;
    db.deleteMany("blog",{"_id":ObjectId(id)},function(err,result){
        res.redirect("/");
    });
})






app.listen(3000);