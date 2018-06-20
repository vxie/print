<%@ page language="java" contentType="text/html;charset=UTF-8"%>
<html>
	<head>
	    <title>套打示例</title>
	    <script language="javascript" src="/js/json2.js"></script>
	    <script language="javascript" src="/js/printUtils.js"></script>
	    
	    <object id="LODOP" classid="clsid:2105C259-1E0C-4534-8141-A753534CB4CA" width="0" height="0"></object>

        <script type="text/javascript">
            var LODOP=document.getElementById("LODOP");//这行语句是为了符合DTD规范
            /*new PrintUtils(打印模板ID,模板背景图路径)*/
            var PrintUtils = new PrintUtils('PrintTemplateDemo1','/images/print_bgimg/billTemplet.GIF');

            PrintUtils.CheckLodop();
        </script>
	</head>

	
	<body>
		

		 

		    <div class="title_center_div">
				<input type="button" class="form_button"  value="打印维护" onclick="PrintUtils.printSetup();">
				<input type="button" class="form_button"  value="打印设计" onclick="PrintUtils.printDesign();">
				<input type="button" class="form_button"  value="打印预览" onclick="PrintUtils.Preview();">
				<input type="button" class="form_button"  value="直接打印" onclick="PrintUtils.directPrint();">
			</div>
	</body>
</html>

