// ==UserScript==
// @name         自写-百度搜索优化版
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  1.屏蔽百度推广。2.关闭百度推广Cookie。3.加入快键键。4.移动最近搜索到上面
// @author       You
// @match        *www.baidu.com/s*
// @grant        none
// ==/UserScript==


(function() {
    'use strict';
    //用于检测快捷键
    $(document).ready(function() {
        changeId();
        window.onkeydown = function() {
            //上一页
            if(event.keyCode == 37 && event.ctrlKey) {
                $(".n:first").click();
            }
            //下一页
            if(event.keyCode == 39 && event.ctrlKey) {
                $(".n:last").click();
            }
            //搜索框
           if(event.keyCode == 13 && event.ctrlKey ) {
               $("#kw").select();
            }
        };
    });
    //改变搜索地址
    $("#su").unbind("click").click(function(){
        $('#form input[hidden]').remove();
       var $searchValue = $("#kw").val();
        //alert($searchValue);
        window.location.href = "https://www.baidu.com/s?ie=UTF-8&wd="+$searchValue;
        hideAdContent();//屏蔽推广
        changeId(); //修改ID
    });

    //每当网页加载时
    window.addEventListener('load',function load(event){
        changeRelateSerchToTop();
        mutationfunc();
        
    }, false);

    //动态监视DOM树的变化
    var observer = new MutationObserver(mutationfunc);
    var wrapper = document.querySelector("#wrapper");
    observer.observe(wrapper, {
        "attributes": true,
        "attributesFilter": ["class"],
    });
   
    mutationfunc();
    
})();
/////////////////////////////////////////////////////////////////////

/** 动态监视DOM函数 **/
function mutationfunc(){

    changeRelateSerchToTop();//将相关搜索移到上面
    hideAdContent();//屏蔽推广
    closeCookie(); //关闭Cookie
}

/** 屏蔽推广 **/
function hideAdContent(){
    //去除普通推广
    var $ad = $("#content_left>div:not([id]),#content_left>#clone,#content_left>div[id^='300']");
    $ad.hide();
    
}

/** 改变 Id **/
function changeId(){
    //改变第一个的id -》后用CSS去id推广
    var $newID=$("#content_left>div[id='1']");
    $newID.attr("id","2");
}

/** 关闭百度联盟Cookie **/
function closeCookie(){
    var cpro_url = "http://help.wangmeng.baidu.com/cpro.php";
    var img = document.createElement("img");
    img.src = cpro_url + "?pry=" + 1 + "&_t=" + (new Date()).getTime();	
}

/** 将相关搜索移到上面 **/
function changeRelateSerchToTop(){
    var child = document.getElementById("rs");
    var parent = document.getElementById("content_left");
    parent.insertBefore(child,parent.childNodes[0]);
    child.style.display="block!important";
    $("#rs").css("margin","0px!important");
}