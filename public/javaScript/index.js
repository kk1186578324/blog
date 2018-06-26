$(function(){

   module.init();

})

var module = {
    
     init:function(){

     $.get("/index",function(result){

                 console.log(result);

             }
         )


     module.initGetMsg(1);
     module.initAddMsg();

     module.initPageOption();
     module.initSubmit();

     },
     initPage:function(){

     	  //默认请求第一页数据
           var nowpage = 1;
           $pageOption =  $(".page-option");
           $pageOption.unbind("click").bind("click",function(){   
             if($(this).attr("data-page")==="odd"){
               console.log(nowpage)
             	if(nowpage==0){
             		return
             	}
             	nowpage--
             }else if($(this).attr("data-page")!=="add"){
             	nowpage = parseInt($(this).attr("data-page"));
             }

             if($(this).attr("data-page")==="add"){

               console.log(nowpage)
               console.log($pageOption.length)
	            if(nowpage== $pageOption.length-2){
	             	return;
	             }

             	nowpage++

             }else if($(this).attr("data-page")!=="odd"){
             	nowpage = parseInt($(this).attr("data-page"));
             }
             module.initGetMsg(nowpage);
         

             for(var i= 0;i<$pageOption.length;i++){
                if($($pageOption[i]).attr("data-page")==nowpage){

                  $($pageOption[i]).addClass("active").siblings().removeClass("active")
                }
             }
           })

     },
//分页
     initPageOption:function(){
     	$("#footer").empty();
     	$.get("/page",function(result){
     		console.log(result);
           var data = result.pageamount;
           var arr = []
           for(var i=0;i<data;i++){
           	var obj = {};
           	obj.count = i;
           	arr.push(obj);
             }
             var compiled = _.template($("#page").html());
			 var html = compiled(arr);
		     $("#footer").append($(html));
     		  console.log(result);
     		 module.initPage();
           	}
     	)
     },
//列表渲染
     initGetMsg:function(page){
     	$.get("/get/message?page="+page,function(result){
           var compiled = _.template($("#content").html());
     		if(result.success){
              var data = result.content;
             $("#content-wrap").empty();
             for(var i = 0,len = data.length;i<len;i++){
               var html = compiled({
               	id:data[i]._id,
                name:data[i].name,
                title:data[i].title,
                content:data[i].content,
                time:data[i].time,
                look:data[i].look
               })
               $("#content-wrap").append($(html));

             }

		      

     		}
     	})

   

       

     },
     //添加留言
     initAddMsg:function(){

     	$("#addMsg").unbind("click").bind("click",function(){
     		$.post("/add/message",{
               "name":$("#name").val(),
               "title":$("#title").val(),
               "content":$("#usercontent").val(),
               "time":module.formatterDateTime(new Date()),
               "look":parseInt(Math.random()*90+10)

     		},function(result){

     			if(result.success){

                  module.initGetMsg(1);
                  module.initPageOption();

     			}

     		})

     	})

     },
     //登录
     initSubmit:function(){

      $(".submit-btn").unbind("click").bind("click",function(){

              $.post("/login", {
                    "name": $("#userName").val(),
                    "password": $("#password").val()
                }, function (result) {
                    if (result.success) {
                        var data = result.content[0];

                        $("#finalImg").attr("src","../avatar/"+data.avatar)
                         
                     
                    }else {

                         


                    }

                })
                


      })

     },
     upLoadfile:function(){
          $("#upFile").unbind("change").bind("change",function(e){
           // 判断是否为IE浏览器： /msie/i.test(navigator.userAgent) 为一个简单正则
            var isIE = /msie/i.test(navigator.userAgent) && !window.opera;
            console.log(e);




          })
 

     },
     formatterDateTime:function (date) {
        var year = date.getFullYear();
        var month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
        var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
    }



}