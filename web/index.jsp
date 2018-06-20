<%@ page language="java" contentType="text/html;charset=UTF-8" %>
<html>
<head>
    <title>套打示例</title>
    <script language="javascript" src="/js/json2.js"></script>
    <script language="javascript" src="/js/printUtils.js"></script>

    <object id="LODOP" classid="clsid:2105C259-1E0C-4534-8141-A753534CB4CA" width="0" height="0"></object>

    <script type="text/javascript">
        var LODOP = document.getElementById("LODOP");//这行语句是为了符合DTD规范
        /*new PrintUtils(打印模板ID,模板背景图路径)*/
        var PrintUtils = new PrintUtils('PrintTemplateDemo1', '/images/backimg2.jpg');

        PrintUtils.CheckLodop();

        var printCode = "\n" +
            "LODOP.PRINT_INITA(-5,1,800,600,\"\");\n" +
            "LODOP.ADD_PRINT_TEXT(35,101,100,25,\"张三\");\n" +
            "LODOP.ADD_PRINT_TEXT(40,284,95,20,\"子\");\n" +
            "LODOP.ADD_PRINT_TEXT(64,284,95,20,\"男\");\n" +
            "LODOP.ADD_PRINT_TEXT(63,102,95,20,\"无\");\n" +
            "LODOP.ADD_PRINT_TEXT(86,101,95,20,\"广东省广州市\");\n" +
            "\n";
    </script>
</head>


<body>


<div class="title_center_div">
    <input type="button" class="form_button" value="打印维护" onclick="PrintUtils.printSetup();">
    <input type="button" class="form_button" value="打印设计" onclick="PrintUtils.printDesign2(printCode);">
    <input type="button" class="form_button" value="打印预览" onclick="PrintUtils.Preview();">
    <input type="button" class="form_button" value="直接打印" onclick="PrintUtils.directPrint();">
</div>
</body>
</html>

