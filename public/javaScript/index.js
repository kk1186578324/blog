$(function(){

   module.init();

})

var module = {
    
     init:function(){



     	

     	
     module.initGetMsg();
     module.initAddMsg();

     },

     initGetMsg:function(){

     	var  page = 1;
     	$.get("/get/message?page="+page,function(result){


           var compiled = _.template($("#content").html());
     		if(result.success){
              var data = result.content;
             $("#content-wrap").empty()
             for(var i = 0,len = data.length;i<len;i++){
               var html = compiled({
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
     initAddMsg:function(){

     	$("#addMsg").unbind("click").bind("click",function(){
     		$.post("/add/message",{
               "name":$("#userName").val(),
               "title":$("#title").val(),
               "content":$("#usercontent").val(),
               "time":module.formatterDateTime(new Date()),
               "look":parseInt(Math.random()*90+10)

     		},function(result){

     			if(result.success){

                  module.initGetMsg();

     			}


         


     		})




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