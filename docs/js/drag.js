//图片放大和缩小（兼容IE和火狐，谷歌）
        function ImageChange(args) {
            var oImg = document.getElementById("imgSignature");
            if (args) {
                oImg.width = oImg.width * 1.2;
                oImg.height = oImg.height * 1.2;
               // oImg.style.zoom = parseInt(oImg.style.zoom) + (args ? +20 : -20) + '%';
            }
            else {
                oImg.width = oImg.width / 1.2;
                oImg.height = oImg.height / 1.2;
            }
        }
    // 构造函数================================================
var Drag = function(opt){
    this.obj = null; // this:Drag对象，this.obj:元素
    this.disX = 0;
    this.disY = 0;
    this.rangeId = null; // 范围
    this.hasRange = false;
    this.rangeJson = {};
    this.settings = { //默认参数
        toDown : function(){},
        toMove : function(){},
        toUp : function(){}
    };
    opt && this.init(opt); 
};


// 方法================================================
Drag.prototype = {
    init: function(opt) {
        if (!opt) { return false;}
        // 处理obj指向
        this.obj = 'string'==(typeof opt.id) ? document.getElementById(opt.id) : opt.id;
        if (opt.rangeId){ // 处理range
            this.rangeId = ('string'==(typeof opt.rangeId) ? document.getElementById(opt.rangeId) : opt.rangeId) ;
            this.hasRange = true;
            this.rangeJson = this.setRange();
            this.obj.style.left = this.rangeJson.left + 'px';
            this.obj.style.top = this.rangeJson.top + 'px';
        }
        this.extend( this.settings , opt );
        this.run();
    },
    run: function(){
        var This = this; 
        this.obj.onmousedown = function(ev){
            This.fnDown( ev||window.event ); 
            document.onmousemove = function(ev){ This.fnMove( ev||window.event ); };
            document.onmouseup = function(){ This.fnUp(); };
            return false;
        };
    },
    fnDown: function(ev) { 
        this.obj.style.zIndex = this.setZindex(); // 设置层级
        this.disX = ev.clientX - this.obj.offsetLeft;
        this.disY = ev.clientY - this.obj.offsetTop;
        if (this.setCapture) {this.setCapture();}
        this.settings.toDown(this.obj); // toDown()
    },
    fnMove: function(ev) {
        var L = ev.clientX - this.disX;
        var T = ev.clientY - this.disY;
        if (this.rangeJson) { // 判断范围
            if ( L < this.rangeJson.left) { L = this.rangeJson.left; } 
            else if (L > this.rangeJson.right) { L = this.rangeJson.right; }
            if ( T < this.rangeJson.top ) { T = this.rangeJson.top; } 
            else if ( T > this.rangeJson.bottom) { T = this.rangeJson.bottom; }
        }
        this.obj.style.left = L + 'px';
        this.obj.style.top = T + 'px';
        this.settings.toMove(this.obj); // toMove()
    },
    fnUp: function() {
        document.onmousemove = null;
        document.onmouseup = null;
        this.settings.toUp(this.obj); // toUp()
        if (this.releaseCapture) {this.releaseCapture();}
    },
    extend: function(obj1,obj2) {
        for(var attr in obj2){ obj1[attr] = obj2[attr]; }
    },
    setZindex: function(){
        var otherDiv = this.obj.parentNode.getElementsByTagName('div');
        var n = 0;
        for(var i=0; i<otherDiv.length; i++){ 
            var dn = parseInt(otherDiv[i].style.zIndex);
            n = ( dn > n ? dn : n );
        }
        return n+1;
    },
    setRange: function(){
        return {
            left : this.posLeft(this.rangeId),  
            right : this.posLeft(this.rangeId) + this.rangeId.offsetWidth - this.obj.offsetWidth,
            top : this.posTop(this.rangeId),
            bottom : this.posTop(this.rangeId) + this.rangeId.offsetHeight - this.obj.offsetHeight
        };
    },
    posLeft: function (obj){ // 获取绝对位置left
        var iLeft = 0;
        while(obj){
            iLeft += obj.offsetLeft;
            obj = obj.offsetParent;
            if(obj && obj!=document.body && obj!=document.documentElement){
                iLeft += this.getStyle(obj, 'borderLeftWidth');
            }
        }
        return iLeft;
    },
    posTop: function (obj){ // 获取绝对位置top
        var iTop = 0;
        while(obj){
            iTop += obj.offsetTop;
            obj = obj.offsetParent;
            if(obj && obj!=document.body && obj!=document.documentElement){
                iTop += this.getStyle(obj, 'borderTopWidth');
            }
        }
        return iTop;
    },
    getStyle: function (obj,attr){
        if(obj.currentStyle){
            return parseFloat( obj.currentStyle[attr]) || 0;
        }
        return parseFloat( getComputedStyle(obj)[attr]) || 0;
    }
}


// 调用================================================
window.onload = function(){
    // // div1
    // var d1 = new Drag({ 
    //     id : 'div1', // 传入对象
    //     toDown : function(obj){
    //         obj.style.opacity = '0.6';
    //         obj.innerHTML = parseInt(obj.innerHTML) +1;
    //     },
    //     toUp : function(obj){
    //         obj.style.opacity = '1';
    //     }
    // });
    // div2
    var d2= new Drag({ 
        id : 'imgSignature', // 传入对象
        rangeId : '', // 限制范围填写id，否则不用填
        toDown : function(obj){
            obj.style.opacity = '0.6';
        },
        toUp : function(obj){
            obj.style.opacity = '1';
        }
    });
};


/*
        //获取div的四个顶点坐标
           function getDivPosition()
           {
           var odiv=document.getElementById('picDiv');
         //  alert(odiv.getBoundingClientRect().left);
         // alert(odiv.getBoundingClientRect().top);
                   
           var xLeft,xRigh,yTop,yBottom;
           return {
                xLeft:odiv.getBoundingClientRect().left,
                xRigh:odiv.getBoundingClientRect().left+130, 
                yTop:odiv.getBoundingClientRect().top,
                yBottom:odiv.getBoundingClientRect().top+130
                };
           }

         //获取鼠标坐标
           function mousePos(e)
           {
                var x,y;
                var e = e||window.event;
                return {
                x:e.clientX+document.body.scrollLeft+document.documentElement.scrollLeft,
                y:e.clientY+document.body.scrollTop+document.documentElement.scrollTop
                };
            };

        //在固定div层拖动图片
        var ie = document.all;
        var nn6 = document.getElementById && !document.all;
        var isdrag = false;
        var y, x;
        var oDragObj;

        
        //鼠标移动
        function moveMouse(e) {     
                //鼠标的坐标
                mousePos(e).x   ;
                mousePos(e).y  ;
                //div的四个顶点坐标
                getDivPosition().xLeft
                getDivPosition().xRigh
                getDivPosition().yTop
                getDivPosition().yBottom
                
            if(isdrag && mousePos(e).x > getDivPosition().xLeft &&  mousePos(e).x < getDivPosition().xRigh  &&  mousePos(e).y >getDivPosition().yTop && mousePos(e).y< getDivPosition().yBottom )
            {
                oDragObj.style.top = (nn6 ? nTY + e.clientY - y : nTY + event.clientY - y) + "px";
                oDragObj.style.left = (nn6 ? nTX + e.clientX - x : nTX + event.clientX - x) + "px";
                return false;
            }
        }

        //鼠标按下才初始化
        function initDrag(e) {
            var oDragHandle = nn6 ? e.target : event.srcElement;
            var topElement = "HTML";
            while (oDragHandle.tagName != topElement && oDragHandle.className != "dragAble") {
                oDragHandle = nn6 ? oDragHandle.parentNode : oDragHandle.parentElement;
            }
            if (oDragHandle.className == "dragAble") {
                isdrag = true;
                oDragObj = oDragHandle;
                nTY = parseInt(oDragObj.style.top + 0);
                y = nn6 ? e.clientY : event.clientY;
                nTX = parseInt(oDragObj.style.left + 0);
                x = nn6 ? e.clientX : event.clientX;
                document.onmousemove = moveMouse;
                return false;
            }
        }
        document.onmousedown = initDrag;
        document.onmouseup = new Function("isdrag=false");*/