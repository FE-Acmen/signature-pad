// 1
// 获取本页表格中最后一行是第几行（对不同高度的表格进行不同的处理）
// var last_counts = $('.counts:last').text();

//监听pdf导出按键
// $('#downloadPdf').click(function () {
//     // 将 id 为 contents 的 div 渲染成 canvas
//     html2canvas(document.getElementById("screen"), {
//         // 渲染完成时调用，获得 canvas
//         onrendered: function(canvas) {
//             // 从 canvas 提取图片数据
//             var imgData = canvas.toDataURL('image/jpeg');
// 　　　　　　　
// 　　　　　　 // 因为我要在每页都加上特定的图片，所以要先将图片转化为base64格式（可以参考这个网站：http://tool.css-js.com/base64.html）
//             var img1_base = '~';
//             var img2_base = '~';
//             //var img3_base = '~';

//             //初始化pdf，设置相应格式（单位为pt,导出a4纸的大小）
//             var doc = new jsPDF("p", "pt", "a4");

//             //图片的位置和尺寸（图片,left,top,width,high）
//             doc.addImage(img1_base, 10, 5, 90, 50);
//             doc.addImage(img2_base, 450, 5, 130, 50);

// 　　　　　　　// 初始导出的页面为270（根据引入的图片和每行表格的高度设置）
//             var img_high = 270;
//             for (var i=1; i<last_counts; i++) {
// 　　　　　　　　　// 然后每增加一行加20的高（因为我的表格是分页的，每页最多26行，所以最高为750）
//                 img_high += 20
//             }
//             doc.addImage(imgData, 10, 65, 580, img_high);
// 　　　　　　　// 页尾再加上一个图片
//             //doc.addImage(img3_base, 450, 780, 120, 40);
//             //输出保存命名为bill的pdf
//             doc.save('bill.pdf');
//         },
// 　　　　　// 导出的pdf默认背景颜色为黑色，所以要设置颜色为白（根据自己的需求设置）
//         background: '#FFF'
//     })
// });


// 2
var downPdf = document.getElementById("downloadPdf");
var screen = document.getElementById("screen");
// screen.css({
//                 "background-color": "white",
//                 "position": "absolute",
//                 "top": "0px",
//                 // "z-index": "-1",
//                 "height": "auto"
//             });
downPdf.onclick = function() {

    html2canvas(screen, {
        //allowTaint:true,
        //height: screen.outerHeight(),
        onrendered: function(canvas) {

                var contentWidth = canvas.width;
                var contentHeight = canvas.height;

                //一页pdf显示html页面生成的canvas高度;
                var pageHeight = contentWidth / 595.28 * 841.89;
                //未生成pdf的html页面高度
                var leftHeight = contentHeight;
                //pdf页面偏移
                var position = 0;
                //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
                var imgWidth = 595.28;
                var imgHeight = 595.28 / contentWidth * contentHeight;

                var pageData = canvas.toDataURL('image/jpeg', 0.95);

                var pdf = new jsPDF('', 'pt', 'a4');
                //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
                //当内容未超过pdf一页显示的范围，无需分页
                if (leftHeight < pageHeight) {
                    pdf.addImage(pageData, 'JPEG', 20, 0, imgWidth, imgHeight);
                } else {
                    while (leftHeight > 0) {
                        pdf.addImage(pageData, 'JPEG', 20, position, imgWidth, imgHeight)
                        leftHeight -= pageHeight;
                        position -= 841.89;
                        //避免添加空白页
                        if (leftHeight > 0) {
                            pdf.addPage();
                        }
                    }
                }

                pdf.save('content.pdf');
            }
            //allowTaint:true,
    })
}


// 3
// $(function () {
//         $("#downloadPdf").click(function () {
//             var targetDom = $("#screen");
//             //把需要导出的pdf内容clone一份，这样对它进行转换、微调等操作时才不会影响原来界面
//             var copyDom = targetDom.clone();
//             //新的div宽高跟原来一样，高度设置成自适应，这样才能完整显示节点中的所有内容（比如说表格滚动条中的内容）
//             copyDom.width(targetDom.width() + "px");
//             copyDom.height(targetDom.height() + "px");
//             copyDom.css({
//                 "background-color": "white",
//                 "position": "absolute",
//                 "top": "0px",
//                 // "z-index": "-1",
//                 "height": "auto"
//             });
//             $('body').append(copyDom);//ps:这里一定要先把copyDom append到body下，然后再进行后续的glyphicons2canvas处理，不然会导致图标为空

//             svg2canvas(copyDom);
//             html2canvas(copyDom, {
//                 allowTaint:true,
//                 height: copyDom.outerHeight(),
//                 onrendered: function (canvas) {
//                     var imgData = canvas.toDataURL('image/jpeg');
//                     var img = new Image();
//                     img.src = imgData;
//                     //根据图片的尺寸设置pdf的规格，要在图片加载成功时执行，之所以要*0.225是因为比例问题
//                     img.onload = function () {
//                         //此处需要注意，pdf横置和竖置两个属性，需要根据宽高的比例来调整，不然会出现显示不完全的问题
//                         if (this.width > this.height) {
//                             var doc = new jsPDF('l', 'mm', [this.width * 0.225, this.height * 0.225]);
//                         } else {
//                             var doc = new jsPDF('p', 'mm', [this.width * 0.225, this.height * 0.225]);
//                         }
//                         doc.addImage(imgData, 'jpeg', 0, 0, this.width * 0.225, this.height * 0.225);
//                         //根据下载保存成不同的文件名
//                         doc.save('pdf_' + new Date().getTime() + '.pdf');
//                     };
//                     //删除复制出来的div
//                     copyDom.remove();
//                 },
//                 background: "#fff",
//                 //这里给生成的图片默认背景，不然的话，如果你的html根节点没设置背景的话，会用黑色填充。
//                 allowTaint: true //避免一些不识别的图片干扰，默认为false，遇到不识别的图片干扰则会停止处理html2canvas
//             });
//         });
//     });

//     function svg2canvas(targetElem) {
//         var svgElem = targetElem.find('svg');
//         svgElem.each(function (index, node) {
//             var parentNode = node.parentNode;
//             //由于现在的IE不支持直接对svg标签node取内容，所以需要在当前标签外面套一层div，通过外层div的innerHTML属性来获取
//             var tempNode = document.createElement('div');
//             tempNode.appendChild(node);
//             var svg = tempNode.innerHTML;
//             var canvas = document.createElement('canvas');
//             //转换
//             canvg(canvas, svg);
//             parentNode.appendChild(canvas);
//         });
//     }

//     function glyphicons2canvas(targetElem, fontClassName, fontFamilyName) {
//         var iconElems = targetElem.find('.' + fontClassName);
//         iconElems.each(function (index, inconNode) {
//             var fontSize = $(inconNode).css("font-size");
//             var iconColor = $(inconNode).css("color");
//             var styleContent = $(inconNode).attr('style');
//             //去掉"px"
//             fontSize = fontSize.replace("px", "");
//             var charCode = getCharCodeByGlyphiconsName(iconName);
//             var myCanvas = document.createElement('canvas');
//             //把canva宽高各增加2是为了显示图标完整
//             myCanvas.width = parseInt(fontSize) + 2;
//             myCanvas.height = parseInt(fontSize) + 2;
//             myCanvas.style = styleContent;
//             var ctx = myCanvas.getContext('2d');
//             //设置绘图内容的颜色
//             ctx.fillStyle = iconColor;
//             //设置绘图的字体大小以及font-family的名字
//             ctx.font = fontSize + 'px ' + fontFamilyName;
//             ctx.fillText(String.fromCharCode(charCode), 1, parseInt(fontSize) + 1);
//             $(inconNode).replaceWith(myCanvas);
//         });
//     }
//     //根据glyphicons/glyphicon图标的类名获取到对应的char code
//     function getCharCodeByGlyphiconsName(iconName) {
//         switch (iconName) {
//             case("glyphicons-resize-full"):
//                 return "0xE216";
//             case ("glyphicons-chevron-left"):
//                 return "0xE225";
//             default:
//                 return "";
//         }
//     }



// 4
// $("#downloadPdf").on("click", function() {
//             //获取节点高度，后面为克隆节点设置高度。
//             var height = $("#screen").height()
//             //克隆节点，默认为false，不复制方法属性，为true是全部复制。
//             var cloneDom = $("#screen").clone(true);
//             //设置克隆节点的css属性，因为之前的层级为0，我们只需要比被克隆的节点层级低即可。
//             cloneDom.css({
//                 "background-color": "white",
//                 "position": "absolute",
//                 "top": "0px",
//                 "z-index": "-1",
//                 "height": "auto"
//             });
//             //将克隆节点动态追加到body后面。
//             $("body").append(cloneDom);
//             //插件生成base64img图片。
//             html2canvas(cloneDom, {
//                 //Whether to allow cross-origin images to taint the canvas
//                 allowTaint: true,
//                 //Whether to test each image if it taints the canvas before drawing them
//                 taintTest: false,
//                 onrendered: function(canvas) {
//                     var img = canvas.toDataURL('image/jpeg', 1.0);
//                     //打印出来之后:data:image/jpeg;base64,/9j/4AAQSkZJRg....
//                     //可以通过chrome来查看
//                     console.log(img);
//                 }
//             });
//         });