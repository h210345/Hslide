(function($) {
	$.fn.hcjSlider = function(opts) {
		var	elem = $(this),//传入的选择器
			li = elem.children(),//图片集合
			len = li.length;//图片长度
		if(len<=1){
			return;
		}
		//默认参数
		var defaults={
			tabNav:true,//有没有tab控制按钮 默认有
			pageNav:true,//有没有页码控制按钮 默认有
			tabNavPosition:'middle',//tab控制按钮位置 默认中
			tabnavCur:'current',//tab控制按钮当前样式
			tabNavChildStyle:'span',//tab控制按钮公共样式
			effect:'scroll',//动画的效果
			tabNavMr:6////tab控制按钮右外边距
		};
		var options=$.extend(defaults,opts);
		var c=0,//索引
			timer, //定时器
			lenW = li.eq(0).find('img').width(),//单个图片的宽度
			lenH = li.eq(0).find('img').height(),//单个图片的高度
			pos = elem.position(),//图片容器的定位位置
			controltabbox,//tab控制按钮box
			controltabnav,//tab控制按钮box中需要追加的元素
			next,//下一页
			prev,//上一页
			controltabboxChild;//tab控制按钮box集合
		//事件相关处理程序对象
		var eventFun =$.fn.hcjSlider.eventFun= {
			//下一页无缝滚动处理程序
			pagenClickwf: function() {
				if(eventFun._booleanAnimate()){
					elem.animate({
						left: pos.left + (-lenW)
					}, 1000, function() {
						elem.css({
							left: 0
						});
						eventFun._replaceFirst(0);
					});
					if (c == len) {
						c = 0;
					}
					eventFun.eqClass(c,controltabboxChild);
				}
			},
			//上一页无缝滚动处理程序
			pagepClickwf: function() {
				if(eventFun._booleanAnimate()){
					eventFun._replaceFirst(len);
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
			//下一页谈入处理程序
			pagenClickEfade:function(){
				c++;
				if (c == len) {
					c = 0;
				}
				eventFun.eqClass(c,controltabboxChild);	
				elem.children().eq(c).fadeIn(300).siblings().fadeOut(100);
			},
			//上一页谈入处理程序
			pagepClickEfade:function(){
				if (c == 0) {
					c = len;
				}
				c--;
				eventFun.eqClass(c,controltabboxChild);	
				elem.children().eq(c).fadeIn(300).siblings().fadeOut(100);
					
			},
			//下一页滚到头再返回处理程序
			pagenClickScroll: function() {
				c++;
				if (c == len) {
					c = 0;
				}
				eventFun.eqClass(c,controltabboxChild);	
				elem.stop().animate({
					left: pos.left + (-lenW*c)
				}, 1000);
			},
			//上一页滚到头再返回处理程序
			pagepClickScroll: function() {
				if (c == 0) {
					c = len;
				}
				c--;
				eventFun.eqClass(c,controltabboxChild);	
				elem.stop().animate({
					left: pos.left + (-lenW*c)
				});
			},
			//图片容器上一级父及的处理程序
			elemhover: function(event) {
				next.show();//进入显示页码控制按钮
				prev.show();
				if (event.type == 'mouseenter') {
					eventFun._clearTimer();//进入清楚定时器
				}
				if (event.type == 'mouseleave') {
					next.hide();//离开隐藏页码控制按钮
					prev.hide();
					eventFun.setTimer(effects[options.effect]);//离开设置定时器
				}
			},
			//控制按钮切换图片
			timerOut:null,
			tabnavhover: function(event) {
				var index=$(this).index();
				if (event.type == 'mouseenter') {
					eventFun._clearTimer();
					if(options.effect=='scroll'){
						eventFun.timerOut=setTimeout(function(){
							elem.stop(true,true).animate({
								left: pos.left + index * -lenW
							}, 1000);
							eventFun.eqClass(index,controltabboxChild);
						},200);
					}
					if(options.effect=='efade'){
						eventFun.timerOut=setTimeout(function(){
							eventFun.eqClass(index,controltabboxChild);
							elem.children().stop(true,true).eq(index).fadeIn(400).siblings().fadeOut(400);
						},200);
					}
				}
				if (event.type == 'mouseleave') {
					clearTimeout(eventFun.timerOut);
					// elem.stop(true,true)
				}
			},
			//控制按钮设置当前样式
			eqClass:function(num,obj){
				obj.eq(num).addClass(options.tabnavCur).siblings().removeClass(options.tabnavCur);
			},
			//设置定时器
			setTimer:function(fun){
				timer = setInterval(fun, 5000);
			},
			//清楚定时器
			_clearTimer:function(){
				clearInterval(timer);
			},
			//判断是否处于动画
			_booleanAnimate:function(){
				if (!elem.is(":animated")) {
					return true;
				}
			},
			//图片首尾调换
			_replaceFirst:function(length){
				var elemChild=elem.find('li');
				if(length==0){//此时首做尾
					elemChild.eq(length).remove().appendTo(elem);
				}
				if(length==len){//此时尾做首
					elemChild.last().remove().prependTo(elem);
				}
			}
		};
		var setStyle=$.fn.hcjSlider.setStyle={};
		//设置tab控制按钮的样式
		setStyle.setTabNavCss=function(){
			controltabboxChild.addClass(options.tabNavChildStyle);
			controltabboxChild.css({'margin-right':options.tabNavMr});
			switch(options.tabNavPosition) {
				case 'middle':
					controltabbox.css({
						bottom:10,
						position: 'absolute',
						left:lenW/2,
						'margin-left':-(controltabbox.width()-options.tabNavMr)/2
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
					controltabboxChild.css({'float':'none','margin-right':0,'margin-bottom':options.tabNavMr});
					controltabbox.css({
						width:controltabboxChild.eq(0).width(),
						right:15,
						position: 'absolute',
						top:lenH/2,
						'margin-top':-(controltabbox.height()-options.tabNavMr)/2
					});
					break;
			}
		};
		//滚动时 需设置图片容器宽度
		setStyle.setElemCss=function(){
			elem.css({
				width: len * lenW
			});
		};
		//efade 效果需设置的样式
		setStyle.setFadeCss=function(){
			elem.height(lenH);
			li.css({
				position:'absolute',
				float:'none',
				display:'none'
			}).eq(0).show();
		};
		//创建追加控制按钮元素
		function createElem(){
			//tab控制按钮
			if(options.tabNav){
				controltabbox = $('<ul></ul>').css({'display':'inline-block'});//tab控制按钮盒子
				controltabnav = "<li></li>";//tab控制按钮盒子内部元素
				controltabbox.appendTo(elem.parent());//tab控制按钮追加到文档
				for (var i = 0; i < len; i++) {
					controltabbox.append(controltabnav);//tab控制按钮box追加elem
				}
				controltabboxChild=controltabbox.children();//tab控制按钮集合
				controltabboxChild.eq(0).addClass(options.tabnavCur);//第一个增加当前样式
				controltabboxChild.bind('mouseenter mouseleave', eventFun.tabnavhover);
				setStyle.setTabNavCss();
			}
			//页码控制按钮
			if(options.pageNav){
				next = $('<div>></div>');//上一页盒子
				prev = $('<div><</div>');//下一页盒子
				next.addClass('next').appendTo(elem.parent()).hide();//上一页盒子增加样式
				prev.addClass('prev').appendTo(elem.parent()).hide();//下一页盒子增加样式
				if(options.effect=='efade'){
					next.bind('click', eventFun.pagenClickEfade);//上一个委派单击
					prev.bind('click', eventFun.pagepClickEfade);//下一个委派单击
				}
				if(options.effect=='wfScroll'){
					next.bind('click', eventFun.pagenClickwf);//上一个委派单击
					prev.bind('click', eventFun.pagepClickwf);//下一个委派单击
				}
				if(options.effect=='scroll'){
					next.bind('click', eventFun.pagenClickScroll);//上一个委派单击
					prev.bind('click', eventFun.pagepClickScroll);//下一个委派单击
				}
				
			}	
		}
		// 效果对象
		var effects=$.fn.hcjSlider.effects={
			// 无缝
			wfScroll:function(){
				elem.animate({
					left: pos.left + (-lenW)
				}, 1000, function() {
					elem.css({
						left: 0
					});
					eventFun._replaceFirst(0);
				});
			},
			// 来回滚
			scroll:function(){
				c++;
				if (c == len) {
					c = 0;
				}
				elem.animate({
					left: pos.left + (-lenW*c)
				}, 1000);
				if(options.tabNav){
					eventFun.eqClass(c,controltabboxChild);
				}
			},
			// 淡入
			efade:function(){
				c++;
				if (c == len) {
					c = 0;
				}
				if(options.tabNav){
					eventFun.eqClass(c,controltabboxChild);
				}	
				elem.children().eq(c).fadeIn(300).siblings().fadeOut(100);
			}
		};
		//判断效果是什么然后设置其样式
		switch(options.effect) {
			case 'scroll':
			setStyle.setElemCss();
				break;
			case 'efade':
			setStyle.setFadeCss();
				break;
		}
		// 存在这个效果对象方法 设置定时器
		if(options.effect){
			eventFun.setTimer(effects[options.effect]);
		}
		if(options.tabNav||options.pageNav){//按钮控制显示判断
			createElem();
		}
		// 总容器委派事件
		elem.parent().bind('mouseenter mouseleave', eventFun.elemhover);//给图片容器的上一级父级 委派事件 进入:动画停止;离开恢复动画;
		
	};
})(jQuery);