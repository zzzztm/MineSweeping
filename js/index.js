$(function(){
    do{
        // 循环创建9*9个初始方块, 并随机产生10个雷
        $("#game-region").empty();
        for(var m = 0; m < 9; m++){
            for(var n = 0; n < 9; n++){
                var isMine = Math.random() < (10 / 81);
                // 给每个块增加位置和id属性
                // 根据是否为雷选择增加isMine类名
                // 绑定点击鼠标事件函数 checkMine
                $("<div></div>").addClass(function(){
                    return "block"+(isMine ? " isMine" : "");
                }).data("pos", {x:m, y:n}).attr("id", m+"-"+n).mousedown(checkMine).appendTo("#game-region");
            }
        }
    }while($(".isMine").length != 10);
})

// 取消右键默认弹出窗口
$(document).bind("contextmenu",function(){
    return false;
});

// 单机表情图片刷新游戏
$(document).on("mousedown", "#face-img", function(){
    $("#face-img").css("border-style", 'inset');
    window.location.reload();
    // $("#face-img").css("background-image", "url(images/face_fail.bmp)")
});

function checkMine(event){
    if(event.which == 1){         // 单击左键事件
        onLeft.call(this)         // 为该事件调用onLeft函数
    }else if(event.which == 3){   // 单击右键事件
        onRight.call(this)        // 为该事件调用onRight函数
    }
}

// 鼠标左键点击事件函数
function onLeft(){
    // 如果游戏已完成则无法再进行点击
    if($("#game-region").hasClass("down")){
        return
    }
    if($(this).hasClass("flag")){       // 已标记为flag则无法左键点击
        return;
    }
    if($(this).hasClass("isMine")){     // 点到雷游戏结束
        // 显示所有雷的位置
        $(".isMine").addClass("show");
        // 点到的雷特殊显示
        $(this).css({"border":"2px solid #9a9a9a", "width":"31px", "height":"31px", "background-image":"url(images/mine2.gif)","background-size":"cover"})
        // 图标变为失败表情
        $("#face-img").css("background-image", "url(images/face_fail.bmp)")
        $("#game-region").addClass("down");
    }else{
        // 点到的不是雷, 计算周围雷数
        $(this).addClass("num");
        var n = 0;
        var pos = $(this).data("pos");
        for(var i = pos.x - 1; i <= pos.x + 1; i++){
            for(var j = pos.y - 1; j <= pos.y + 1; j++){
                if($("#" + i + "-" + j).hasClass('isMine')){
                    n++;
                }
            }
        }
        
        // 将雷数显示在该位置
        $(this).css({"border":"2px solid #9a9a9a", "width":"31px", "height": "31px"})
        $(this).text(n != 0 ? n : "");
        
        // 为不同雷数设置不同颜色

        var num = $(this).text();
        switch (num) {
            case ("1"):
                $(this).css("color","#0000ff")
                break;
            case ("2"):
                $(this).css("color","#028102")
                break;
            case ("3"):
                $(this).css("color","#fe0202")
                break;
            case ("4"):
                $(this).css("color","#000080")
                break;
            case ("5"):
                $(this).css("color","#810303")
                break;
            case ("6"):
                $(this).css("color","#038181")
                break;
            case ("7"):
                $(this).css("color","#040404")
                break;
            case ("8"):
                $(this).css("color","#828282")
                break;
        }

        // 如果所点区域为0, 则触发周围区域点击事件
        if(n == 0){
            for(var i = pos.x - 1; i <= pos.x + 1; i++){
                for(var j = pos.y - 1; j <= pos.y + 1; j++){
                    if($("#" + i + "-" + j).length != 0){
                        if(!$("#" + i + "-" + j).data("check")){
                            $("#" + i + "-" + j).data("check", true);
                            onLeft.call($("#" + i + "-" + j));
                        }
                    }
                }
            }
        }

        // 所有无雷的位置均点击过则成功
        if($(".block").filter(".num").length == 71){
            $("#face-img").css("background-image", "url(images/face_success.bmp)")
            $("#game-region").addClass("down");
        }
    }
}

// 设定初始应有flag数
var flagNum = 10;
var index = "";
function onRight(){
    // 如果游戏已完成则无法再进行点击
    if($("#game-region").hasClass("down")){
        return
    }
    
    // 对已点击过并显示数字的区域右键无效
    if($(this).hasClass("num")){
        return;
    }
    
    if($(this).hasClass("flag")){
        flagNum ++;
        if(flagNum <= 0){
            index = "000"
        }else{
            index = (Array(3).join("0") + flagNum).slice(-3);
        }
        $("#flagx").attr("src", "images/d"+index[0]+".bmp");
        $("#flagy").attr("src", "images/d"+index[1]+".bmp");
        $("#flagz").attr("src", "images/d"+index[2]+".bmp");
    }else{
        flagNum --;
        if(flagNum <= 0){
            index = "000"
        }else{
            index = (Array(3).join("0") + flagNum).slice(-3);
        }
        $("#flagx").attr("src", "images/d"+index[0]+".bmp");
        $("#flagy").attr("src", "images/d"+index[1]+".bmp");
        $("#flagz").attr("src", "images/d"+index[2]+".bmp");
    }

    // 没有flag则添加类名
    // 已有flag则删除类名
    $(this).toggleClass("flag");

    // 当标注的flag与已有雷位置完全一致后成功
    if($(".flag").filter(".isMine").length == 10){
        $("#face-img").css("background-image", "url(images/face_success.bmp)")
        $("#game-region").addClass("down");
    }
}

// 设定计时器
var x = 0, y = 0, z = 0;
// 设定当第一次点击鼠标左键或右键时启动
$(document).one("mousedown", ".block", function(){
    var timer = setInterval(function(){ 
        // 当时间为999或游戏结束时停止计时器
        if((x == 9 && y == 9 && z == 9) || $("#game-region").hasClass("down")){
            clearInterval(timer);
            return;
        }
        z ++;
        if(z == 10){
            z = 0;
            y ++; 
        }
        if(y == 10){
            y = 0;
            x ++;
        }
        $("#timex").attr("src", "images/d"+x+".bmp");
        $("#timey").attr("src", "images/d"+y+".bmp");
        $("#timez").attr("src", "images/d"+z+".bmp");
    },1000)
});