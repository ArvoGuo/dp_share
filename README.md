##整理大众点评app分享的功能

#使用
------------------------------
1.默认配置，进入dp_Share.js，修改相应配置即可
```
	window.shareDefault = {
	    title: '标题',
	    desc: '描述',
	    link: '链接',
	    image: '图片' //需要放在cdn
	}
```
------------------------------
2.若有动态改变分享内容的需求，如下，改变配置，并使其生效
```
	window.shareDefault.title = '新标题'；
	window.shareDefault.desc = '新描述';
	window.shareDefault.link = '新链接';
	window.shareDefault.image = '新图片';
	initConfit(shareDefault); //使新配置生效
```
------------------------------
3.若需要为点击事件产生分享，如下，直接调用方法，并且使用默认参数shareApp即可
```
	$().click(function(){
		share_Wx_Dp_Attach(shareApp); 
	})
```
4.额外说明，如果是从点评分享出去的链接，请在分享链接后加上参数 platform=notindp
```
	如：
	link = "http://www.dianping.com?platform=notindp"
```
