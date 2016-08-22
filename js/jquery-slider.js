(function($) {
	$.fn.hcjSlider = function(opts) {
		//默认参数
		var option={
			runDirection:'left',
			tabNav:1
		};
		var	c = 0,
			timer, //定时器
			elem = $(this),//传入的选择器
			li = elem.children(),//图片集合
			len = li.length,
			lenW = li.eq(0).width(),//单个图片的宽度
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
			//控制按钮设置当前样式
			eqClass:function(c,obj){
				obj.eq(c).addClass('current').siblings().removeClass('current');
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
					setTimer();
				}
			},
			//控制按钮切换图片
			tabnavhover: function(event) {
				if (event.type == 'mouseenter') {
					clearTimer();
					var index=$(this).index();
					elem.animate({
						left: pos.left + index * -lenW
					}, 1000);
					eventFun.eqClass(index,controltabboxChild);
				}
				if (event.type == 'mouseleave') {
					elem.stop(true,true);
				}
			}
		};
		//设置容器宽度
		function setCss(){
			elem.css({
				width: len * lenW
			});
		}
		//追加控制按钮元素
		function appendelem(){
			controltabbox = $('<div></div>');
			controltabnav = "<span></span>";
			next = $('<div>></div>');
			prev = $('<div><</div>');
			controltabbox.addClass('controltabbox').appendTo(elem.parent());
			for (var i = 0; i < len; i++) {
				controltabbox.append(controltabnav);
			}
			controltabboxChild=controltabbox.children();
			controltabboxChild.eq(0).addClass('current');
			next.addClass('next').appendTo(elem.parent());
			prev.addClass('prev').appendTo(elem.parent());
		}
		//滚动效果方法
		function scrollrun() {
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
		//设置定时器
		function setTimer() {
			timer = setInterval(scrollrun, 3000);
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
		setCss();
		appendelem();
		setTimer();
		next.bind('click', eventFun.nextclick);//上一个委派单击
		prev.bind('click', eventFun.prevclick);//下一个委派单击
		elem.parent().bind('mouseenter mouseleave', eventFun.elemhover);//给图片容器的上一级父级 委派事件 进入:动画停止;离开恢复动画;
		controltabbox.children().bind('mouseenter mouseleave', eventFun.tabnavhover);
	};
})(jQuery);