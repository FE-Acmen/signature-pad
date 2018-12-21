//PDF转图片
//$("#downloadPdf").attr("disabled", "disabled"); //禁用导出图片按钮
var pdfFile;
$('#pdf').change(function() {
    var pdfFileURL = $('#pdf').val();
    if (pdfFileURL) {
        $("#imgDiv").empty(); //清空上一PDF文件展示图
        var files = $('#pdf').prop('files'); //获取到文件
        var fileSize = files[0].size;
        var mb;
        if (fileSize) {
            mb = fileSize / 1048576;
            if (mb > 10) {
                alert("文件大小不能>10M");
                return;
            }
        }

        //$("#downloadPdf").removeAttr("disabled", "disabled");
        $("#pdfName").text(files[0].name).attr("title", files[0].name);
        $("#sizeText").text(mb.toFixed(2) + "Mb");

        /*pdf.js无法直接打开本地文件,所以利用FileReader转换*/
        var reader = new FileReader();
        reader.readAsArrayBuffer(files[0]);
        reader.onload = function(e) {
            var myData = new Uint8Array(e.target.result)
            var docInitParams = {
                data: myData
            };
            var typedarray = new Uint8Array(this.result);
            PDFJS.getDocument(typedarray).then(function(pdf) { //PDF转换为canvas
                $("#imgDiv").css("border", "0"); //清除文本、边框
                if (pdf) {
                    var pageNum = pdf.numPages;
                    $("#pagesText").text(pageNum);

                    for (var i = 1; i <= pageNum; i++) {
                        var canvas = document.createElement('canvas');
                        //$(canvas).attr('id','idCanvas');
                        canvas.id = "pageNum" + i;
                        canvas.style.background = "#fff";
                        $("#imgDiv").append(canvas);
                        var context = canvas.getContext('2d');
                        openPage(pdf, i, context);
                    }
                }
            });
        };
    }
});

function openPage(pdfFile, pageNumber, context) {
    var scale = 2;
    pdfFile.getPage(pageNumber).then(function(page) {
        viewport = page.getViewport(scale); // reference canvas via context
        var canvas = context.canvas;
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        var renderContext = {
            canvasContext: context,
            viewport: viewport
        };
        page.render(renderContext);
    });
    return;
};