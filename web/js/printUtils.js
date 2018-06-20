/**
 * 
 * @param printTempID 打印模板ID
 * @param bkImgPath	  模板背景图路径
 * @return
 */
function PrintUtils(printTempID,bkImgPath) {
	this.printTempID = printTempID; // 打印模板ID
	this.bkImgPath = bkImgPath; // 模板背景图
	this.data = null; // 请求参数
	try {

	} catch(e) {}
}
/**
 * 检查lodop控件是否已安装或是否需要更新
 * @return
 */
PrintUtils.prototype.CheckLodop = function(){
   var oldVersion=LODOP.Version;
       newVerion="5.0.5.8";
   if (oldVersion==null){
	document.write("<h3><font color='#FF00FF'>打印控件未安装!点击这里<a href='/active/lodop/install_lodop.exe'>执行安装</a>,安装后请刷新页面。</font></h3>");
	if (navigator.appName=="Netscape")
	document.write("<h3><font color='#FF00FF'>（Firefox浏览器用户需先点击这里<a href='/active/lodop/npActiveXFirefox4x.xpi'>安装运行环境</a>）</font></h3>");
   } else if (oldVersion<newVerion)
	document.write("<h3><font color='#FF00FF'>打印控件需要升级!点击这里<a href='/active/lodop/install_lodop.exe'>执行升级</a>,升级后请重新进入。</font></h3>");
}
/**
 * 准备打印所需的ajax请求参数,各个页面可根据元素的具体情况重写这个方法
 * @param printTempID 打印模板ID
 * @param designFlag  1 为打印设计; 0 为打印维护 或 打印预览
 * @return
 */
PrintUtils.prototype.preparePrintData = function(printTempID,designFlag) {
	
	var printTempID_ = printTempID ? printTempID : this.printTempID;
	var data = {"TemplateID":printTempID_};
	if("1" != designFlag) {
		var paramIndex = [];
		$('.printtextParam').each(function(index,domEle){
			paramIndex.push("textparam_"+index);
			data["textparam_"+index+"_paramName"] = $(domEle).find("input:hidden").val();
			data["textparam_"+index+"_paramValue"] = $(domEle).find("input:text").val();
		});
		$('.printlabelParam').each(function(index,domEle){
			paramIndex.push("labelparam_"+index);
			data["labelparam_"+index+"_paramName"] = $(domEle).find("input:hidden").val();
			data["labelparam_"+index+"_paramValue"] = $(domEle).text();
		});
		$('.printSelectParam').each(function(index,domEle){
			paramIndex.push("Selectparam_"+index);
			data["Selectparam_"+index+"_paramName"] = $(domEle).find("input:hidden").val();
			data["Selectparam_"+index+"_paramValue"] = $(domEle).find("option:selected").text();
		});
		$('.printtextAreaParam').each(function(index,domEle){
			paramIndex.push("textAreaparam_"+index);
			data["textAreaparam_"+index+"_paramName"] = $(domEle).find("input:hidden").val();
			data["textAreaparam_"+index+"_paramValue"] = $(domEle).find("textarea").val();
		});
		data.paramIndex = paramIndex;
	}
	this.data = data;
	
}
/**
 * 通过此方法可使页面中的元素如文本框、下拉框、文本区域textarea等纳入打印范围,
 * 操作员只要在"打印设计"中输入 ${页面上的元素名} 即可。
 * @param {Object} array	  需要打印的元素数组[${ele1},${ele2},...]
 * @param {Object} setupCode  打印代码
 * @return {TypeName} 
 */
PrintUtils.prototype.handleSetupCode = function(array,setupCode) {
	for(var i=0;i<array.length-1;i++) {
		var tmp1 = array[i]+"";
		var tmp2 = tmp1.substring(2,tmp1.length-1);
		$("td").each(function(index,domEle) {
			if(tmp2 == $.trim($(domEle).text()) || $.trim($(domEle).text()).indexOf(tmp2) > -1) {
				var nextDom = $(domEle).next();
				if($(nextDom).find(":text").length > 0) {
					setupCode = setupCode.replace(tmp1,$(nextDom).find(":text").val());
				}else if($(nextDom).find("select").length > 0) {
					setupCode = setupCode.replace(tmp1,$(nextDom).find("select option:selected").text());
				}else if($(nextDom).find("textarea").length > 0) {
					setupCode = setupCode.replace(tmp1,$(nextDom).find("textarea").text().replace(/\r/ig,"").replace(/\n/ig,""));
				}else {
					setupCode = setupCode.replace(tmp1,$.trim($(nextDom).text()));
				}
			}
		});
	}
	return setupCode;
}
/**
* 打印设计
* @param printTempID 打印模板ID
* @param bkImgPath	  模板背景图
* @return
*/
PrintUtils.prototype.printDesign = function(printTempID,bkImgPath) {
	var printTempID_ = encodeURI(printTempID ? printTempID : this.printTempID);
	var bkImgPath_ = bkImgPath ? bkImgPath : this.bkImgPath;
	this.preparePrintData(printTempID_,1);
	var url = contextPath+"/base/printtemp_genPrintCode.do?design=1" ;
	var callBack = this.handlePrintDesign(bkImgPath_,printTempID_, this);
	$.ajax({
		type : "POST",
		url : url,
		data : this.data,
		traditional : true, // zhangsiwei (JQuery1.4)为传递JSON数组，traditional需设置为true
		contentType : "application/x-www-form-urlencoded;charset=UTF-8",
		cache : false,
		success : callBack,
		error : function(data) {alert(data);}
	}); 
}
/**
 * 打印设计请求成功之处理函数
 * @param bkImgPath
 * @param printTempID
 * @return
 */
PrintUtils.prototype.handlePrintDesign = function(bkImgPath,printTempID, t) {
	return function(data) {
		var json = JSON.parse(data);
		if(json.flag == 1) {
			var oldDesignCode = json.designCode;
			eval(oldDesignCode);
			if(bkImgPath) {
				LODOP.ADD_PRINT_SETUP_BKIMG("<img border='0' src='"+bkImgPath+"'>");
			}
			//LODOP.SET_SHOW_MODE("HIDE_PBUTTIN_PREVIEW", 1);//隐藏预览窗口的打印按钮(设计、测试要求屏蔽!)
			//LODOP.SET_SHOW_MODE("HIDE_PBUTTIN_SETUP", 1);//隐藏打印维护窗口的打印按钮(似乎6.0版本才生效)(设计、测试要求屏蔽!)
			var newDesignCode = LODOP.PRINT_DESIGN();
			if(oldDesignCode.replace(/\r/ig,"").replace(/\n/ig,"") 
					!= newDesignCode.replace(/\r/ig,"").replace(/\n/ig,"")) {
				// 保存新的打印代码
				t.updatePrintTemp(printTempID,newDesignCode);
			}
		}else {
			$(top.document.getElementById("messageLayer")).html(json.promptMsg);
			top.showMessageLayer();
		}
	}
}
/**
 * 打印维护
 * @param printTempID
 * @param bkImgPath
 * @return
 */
PrintUtils.prototype.printSetup = function(printTempID,bkImgPath) {
	var printTempID_ = encodeURI(printTempID ? printTempID : this.printTempID);
	var bkImgPath_ = bkImgPath ? bkImgPath : this.bkImgPath;
	this.preparePrintData(printTempID_,0);
	var url = contextPath+"/base/printtemp_genPrintCode.do?design=0" ;
	var callBack = this.handlePrintSetup(bkImgPath_, this);
	$.ajax({
		type : "POST",
		url : url,
		data : this.data,
		traditional : true, // zhangsiwei (JQuery1.4)为传递JSON数组，traditional需设置为true
		contentType : "application/x-www-form-urlencoded;charset=UTF-8",
		cache : false,
		success : callBack,
		error : function(data) {alert(data);}
	});
}
/**
 * 打印维护请求成功之处理函数
 * @param bkImgPath
 * @return
 */
PrintUtils.prototype.handlePrintSetup = function(bkImgPath, t) {
	 return function(data) {
		 var json = JSON.parse(data);
			if(json.flag == 1) {
				eval(json.setupCode);
				t.dynamicListPrintSetup();
				if(bkImgPath) {
					LODOP.ADD_PRINT_SETUP_BKIMG("<img border='0' src='"+bkImgPath+"'>");
				}
				LODOP.PRINT_SETUP();
			}else {
				$(top.document.getElementById("messageLayer")).html(json.promptMsg);
				top.showMessageLayer();
			}
	 }
}
/**
 * 打印维护时读取动态列表数据，根据需要在具体的jsp页面中重写此方法
 * @return
 */
PrintUtils.prototype.dynamicListPrintSetup = function() {
}
/**
 * 打印预览或直接打印时读取动态列表数据，根据需要在具体的jsp页面中重写此方法
 * @return
 */
PrintUtils.prototype.dynamicList = function() { 
}

/**
 * 打印预览
 * @param seeBkImg 预览时背景图是否可见，1为可见,0为不可见
 * @param printTempID
 * @param bkImgPath
 * @return
 */
PrintUtils.prototype.Preview = function(seeBkImg,printTempID,bkImgPath) {
	var printTempID_ = encodeURI(printTempID ? printTempID : this.printTempID);
	var bkImgPath_ = bkImgPath ? bkImgPath : this.bkImgPath;
	this.preparePrintData(printTempID_,0);
	var url = contextPath+"/base/printtemp_genPrintCode.do?design=0" ;
	var callBack = this.handlePreview(seeBkImg,bkImgPath_,this);	
	$.ajax({
		type : "POST",
		url : url,
		data : this.data,
		async : false,
		traditional : true, // zhangsiwei (JQuery1.4)为传递JSON数组，traditional需设置为true
		contentType : "application/x-www-form-urlencoded;charset=UTF-8",
		cache : false,
		success : callBack,
		error : function(data) {}
	});
}
/**
 * 打印预览请求成功之处理函数
 * @param seeBkImg
 * @param bkImgPath
 * @param t this
 * @return
 */
PrintUtils.prototype.handlePreview = function(seeBkImg,bkImgPath,t) {
	var completeFn = this.onPreviewComplete;
	return function(data) {
		var json = JSON.parse(data);
		if(json.flag == 1) {
			var patten=new RegExp("\\$\\{[^\\}]*?\\}","g"); // 查找${}内的内容
			var array = [];
			var tmp = "";
			
			while(tmp != null) {
				tmp = patten.exec(json.setupCode);
				array.push(tmp);
			}// array数组最后一个元素为null，将舍弃
			
			json.setupCode = t.handleSetupCode(array,json.setupCode);
			eval(json.setupCode);
			t.dynamicList();
			if((!seeBkImg || seeBkImg && seeBkImg == "1") && bkImgPath) {
				LODOP.ADD_PRINT_SETUP_BKIMG("<img border='0' src='"+bkImgPath+"'>");
				LODOP.SET_SHOW_MODE("BKIMG_IN_PREVIEW",1); //注："BKIMG_IN_PREVIEW"-预览包含背景图
			}
			t.setPreviewWindow();
			LODOP.PREVIEW();
		}else {
			/*$(top.document.getElementById("messageLayer")).html(json.promptMsg);
			top.showMessageLayer();*/
            var topOB = top.document;
            if(topOB != null && topOB != undefined) {
                var layerOB = top.document.getElementById("messageLayer");
                if (layerOB != null && topOB != undefined) {
                    $(top.document.getElementById("messageLayer")).html(json.promptMsg);
                    top.showMessageLayer();
                } else {
                    alert(json.promptMsg);
                }
            }else {
                alert(json.promptMsg);
            }
		}
		if ("function" == typeof(completeFn)) {
			completeFn();
		}
	}
}
/**
 * 设置预览窗口属性，如窗口大小，是否显示打印按钮等
 */
PrintUtils.prototype.setPreviewWindow = function() { 
	LODOP.SET_PREVIEW_WINDOW(1,0,0,screen.width,screen.height,"");
	//LODOP.SET_SHOW_MODE("HIDE_PBUTTIN_PREVIEW", 1);//隐藏预览窗口的打印按钮(设计、测试要求屏蔽!)
}
/**
 * 直接打印
 * @param printTempID
 * @param bkImgPath
 * @return
 */
PrintUtils.prototype.directPrint = function(printTempID,bkImgPath) {
	var printTempID_ = encodeURI(printTempID ? printTempID : this.printTempID);
	var bkImgPath_ = bkImgPath ? bkImgPath : this.bkImgPath;
	this.preparePrintData(printTempID_,0);
	var url = contextPath+"/base/printtemp_genPrintCode.do?design=0" ;
	var callBack = this.handleDirectPrint(this);
	$.ajax({
		type : "POST",
		url : url,
		data : this.data,
		traditional : true, // zhangsiwei (JQuery1.4)为传递JSON数组，traditional需设置为true
		contentType : "application/x-www-form-urlencoded;charset=UTF-8",
		cache : false,
		success : callBack,
		error : function(data) {alert(data);}
	});
}
/**
 * 直接打印请求成功之处理函数
 * @return
 */
PrintUtils.prototype.handleDirectPrint = function(t) {
	var completeFn = this.onDirectPrintComplete;
	return function(data) {
		var printSuccess = 0;
		var json = JSON.parse(data);
		if(json.flag == 1) {
			var patten=new RegExp("\\$\\{[^\\}]*?\\}","g"); // 查找${}内的内容
			var array = [];
			var tmp = "";
			
			while(tmp != null) {
				tmp = patten.exec(json.setupCode);
				array.push(tmp);
			}// array数组最后一个元素为null，将舍弃
			
			json.setupCode = t.handleSetupCode(array,json.setupCode);
			eval(json.setupCode);
			t.dynamicList();
			printSuccess = LODOP.PRINT(); // 打印成功返回true或1，失败返回false或0
			t.afterPrint(printSuccess);
		} else {
	    	/*$(top.document.getElementById("messageLayer")).html(json.promptMsg);
			top.showMessageLayer();*/

            var topOB = top.document;
            if(topOB != null && topOB != undefined) {
                var layerOB = top.document.getElementById("messageLayer");
                if (layerOB != null && topOB != undefined) {
                    $(top.document.getElementById("messageLayer")).html(json.promptMsg);
                    top.showMessageLayer();
                } else {
                    alert(json.promptMsg);
                }
            }else {
                alert(json.promptMsg);
            }
		}
		if ("function" == typeof(completeFn)) {
			completeFn(printSuccess);
		}
	}
}
/**
 * 打印成功或失败后的后续工作（用于直接打印）
 * @param printSuccess
 * @return
 */
PrintUtils.prototype.afterPrint = function(printSuccess) {
	if(printSuccess==true || printSuccess == 1)
	{
		$.ajax({
             	type:"POST",
            	url: "/base/printtemp_updateInvoidceNo.do",
             	success:function(data){
             		if("yes" == data.status)
					{
						alert('打印成功');
					}else{
						alert(data.message);
					}
             	}
        });
	}
}

/**
 * 更新模板的打印代码
 * @param basepath
 * @param templateID
 * @param printCode
 * @return
 */
PrintUtils.prototype.updatePrintTemp = function(printTempID,printCode) {
	var printTempID_ = encodeURI(printTempID ? printTempID : this.printTempID);
	if(!printTempID_ || !printCode)
		return;
	var data = {"TemplateID":printTempID_};
	data.printCode = encodeURI(printCode);
	var url = contextPath+"/base/printtemp_updatePrintTemp.do" ;
	$.ajax({
		type : "POST",
		url : url,
		data : data,
		//traditional : true, // zhangsiwei (JQuery1.4)为传递JSON数组，traditional需设置为true
		contentType : "application/x-www-form-urlencoded;charset=UTF-8",
		cache : false,
		beforeSend : function() {
						if($("#printButtonID").length > 0) {
							$("#printButtonID").attr("disabled",true);
						}
					 },
		complete : function() {
						 if($("#printButtonID").length > 0) {
							$("#printButtonID").attr("disabled",false);
						}
				   }
	});
}

PrintUtils.prototype.CheckControlObj = function(){
    try {
        var comActiveX = new ActiveXObject("MIDDLEWAREX.MiddleWareXCtrl.1");
    } catch(e) {
       document.write("<h3><font color='#FF00FF'>电子签名控件未安装!点击这里<a href='/active/sign/gdydocx-setup-1.8.0_20130105.exe'>执行安装</a>,安装后请刷新页面。</font></h3>");
    }
}