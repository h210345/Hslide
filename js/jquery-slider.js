(function($) {
	$.fn.hcjSlider = function(opts) {
		//默认参数
		var defaults={
			tabNav:true,
			pageNav:true,
			tabNavPosition:'middle',
			tabnavCur:'current',
			tabNavChildStyle:'span',
			effect:'scroll'
		};
		var options=$.extend(defaults,opts);
		var	c = 0,
			timer, //定时器
			elem = $(this),//传入的选择器
			li = elem.children(),//图片集合
			len = li.length,//图片长度
			lenW = li.eq(0).find('img').width(),//单个图片的宽度
			lenH = li.eq(0).find('img').height(),//单个图片的高度
			pos = elem.position(),//图片容器的定位位置
			controltabbox,//tab控制按钮box
			controltabnav,//tab控制按钮box中需要追加的元素
			next,//下一页
			prev,//上一页
			controltabboxChild;
		//事件相关处理程序对象
		var eventFun = {
			//下一页处理程序
			nextclick: function() {
				clearTimer();
				var booleanReslut = booleanAnimate();
				if (booleanReslut) {
					c++;
					elem.animate({
						left: pos.left + (-lenW)
					}, 1000, function() {
						elem.css({
							left: 0
						});
						eventFun.replaceFirst(0);
					});
					if (c == len) {
						c = 0;
					}
					eventFun.eqClass(c,controltabboxChild);
				}
			},
			//上一页处理程序
			prevclick: function() {
				clearTimer();
				var booleanReslut = booleanAnimate();
				if (booleanReslut) {
					eventFun.replaceFirst(len);
					elem.css({
						left: pos.left + (-lenW)
					});
					elem.animate({
						left: 0
					}, 1000);
					if (c == 0) {
						c = len;
					}
					c--;
					eventFun.eqClass(c,controltabboxChild);
				}
			},
			//图片首尾调换
			replaceFirst:function(length){
				var elemChild=elem.find('li');
				if(length==0){//此时首做尾
					elemChild.eq(length).remove().appendTo(elem);
				}
				if(length==len){//此时尾做首
					elemChild.last().remove().prependTo(elem);
				}
			},
			//图片容器上一级父及的处理程序
			elemhover: function(event) {
				if (event.type == 'mouseenter') {
					clearTimer();
				}
				if (event.type == 'mouseleave') {
					setTimer(effects[options.effect]);
				}
			},
			//控制按钮切换图片
			tabnavhover: function(event) {
				if (event.type == 'mouseenter') {
					clearTimer();
					var index=$(this).index();
					eventFun.eqClass(index,controltabboxChild);
					if(options.effect=='scroll'){
						elem.stop(true, true).animate({
							left: pos.left + index * -lenW
						}, 1000);
					}
					if(options.effect=='efade'){
						elem.children().eq(index).fadeIn(200).siblings().hide();
					}
				}
				if (event.type == 'mouseleave') {
					elem.stop(true,true);
				}
			}

		};
		function setTabNavCss(){
			controltabboxChild.addClass(options.tabNavChildStyle);
			switch(options.tabNavPosition) {
				case 'middle':
					controltabbox.css({
						bottom:10,
						position: 'absolute',
						left:lenW/2,
						'margin-left':-controltabbox.width()/2
					});
					break;
				case 'right':
					controltabbox.css({
						right:30,
						bottom:10,
						position: 'absolute',
					});
					break;
				case 'rightMiddle':
					controltabbox.css({
						width:controltabboxChild.eq(0).width(),
						right:15,
						position: 'absolute',
						top:lenH/2,
						'margin-top':-controltabbox.height()/2
					});
					break;
			}
		}
		//追加控制按钮元素
		function appendelem(){
			//tab控制按钮
			if(options.tabNav){
				controltabbox = $('<div></div>');//tab控制按钮盒子
				controltabnav = "<span></span>";//tab控制按钮盒子内部元素
				controltabbox.appendTo(elem.parent());//tab控制按钮追加到文档
				for (var i = 0; i < len; i++) {
					controltabbox.append(controltabnav);//tab控制按钮box追加elem
				}
				controltabboxChild=controltabbox.children();//tab控制按钮集合
				controltabboxChild.eq(0).addClass(options.tabnavCur);//第一个增加当前样式
				controltabboxChild.bind('mouseenter mouseleave', eventFun.tabnavhover);
				//控制按钮设置当前样式
				eventFun.eqClass=function(c,obj){
					obj.eq(c).addClass('current').siblings().removeClass('current');
				};
				setTabNavCss();
			}
			//页码控制按钮
			if(options.pageNav){
				next = $('<div>></div>');//上一页盒子
				prev = $('<div><</div>');//下一页盒子
				next.addClass('next').appendTo(elem.parent());//上一页盒子增加样式
				prev.addClass('prev').appendTo(elem.parent());//下一页盒子增加样式
				next.bind('click', eventFun.nextclick);//上一个委派单击
				prev.bind('click', eventFun.prevclick);//下一个委派单击
			}	
		}
		// 效果对象
		var effects={
			scroll:function(){
				c++;
				elem.animate({
					left: pos.left + (-lenW)
				}, 1000, function() {
					elem.css({
						left: 0
					});
					eventFun.replaceFirst(0);
				});
				if (c == len) {
					c = 0;
				}
				if(eventFun.eqClass){
					eventFun.eqClass(c,controltabboxChild);
				}
			},
			efade:function(){
				c++;
				if (c == len) {
					c = 0;
				}
				elem.children().eq(c).fadeIn(200).siblings().hide();
				if(eventFun.eqClass){
					eventFun.eqClass(c,controltabboxChild);
				}
			}
		};
		//设置定时器
		function setTimer(fun) {
			// debugger;
			timer = setInterval(fun, 3000);
		}
		//清楚定时器
		function clearTimer() {
			clearInterval(timer);
		}
		//判断是否处于动画
		function booleanAnimate() {
			if (!elem.is(":animated")) {
				return true;
			}
		}
		//判断效果是什么然后设置其样式
		switch(options.effect) {
			case 'scroll':
			setCss();
				break;
			case 'efade':
			setFadeCss();
				break;
		}
		//滚动时 需设置容器宽度
		function setCss(){
			elem.css({
				width: len * lenW
			});
		}
		//fade 效果需设置的样式
		function setFadeCss(){
			elem.height(lenH);
			li.css({
				position:'absolute',
				float:'none',
				display:'none'
			}).eq(0).show();
		}
		// 存在这个效果对象方法 设置定时器
		if(options.effect){
			setTimer(effects[options.effect]);
		}
		if(options.tabNav||options.pageNav){//按钮控制显示判断
			appendelem();
		}
		elem.parent().bind('mouseenter mouseleave', eventFun.elemhover);//给图片容器的上一级父级 委派事件 进入:动画停止;离开恢复动画;
		
	};
})(jQuery);