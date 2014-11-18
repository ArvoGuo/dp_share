window.shareDefault = {
    title: '标题',
    desc: '描述',
    link: '链接',
    image: '图片' //需要放在cdn
}
window.shareWX = {
    appid: 'wx841a97238d9e17b2'
};
window.shareWXTL = {
    appid: 'wx841a97238d9e17b2'
};
window.shareApp = {
    appid: 'wx841a97238d9e17b2'
};
initConfit(shareDefault);
autoListenWx(shareWX, shareWXTL);
//右上角
try {

    window.DPApp = {};
    window.DPApp.shareConfig = {
        url: shareDefault.link,
        image: shareDefault.image,
        title: shareDefault.desc,
        desc: shareDefault.title
    }

    function initShare() {
        var iframe = document.createElement("iframe"),
            frameContainer = document.createElement("div"),
            shareConfig = "dpshare://_?content=" + encodeURIComponent(JSON.stringify(window.DPApp.shareConfig));
        frameContainer.setAttribute('style', 'display:none');
        frameContainer.appendChild(iframe);
        document.body.appendChild(frameContainer);
        iframe.setAttribute("src", shareConfig);
    }

    window.onload = function() {
        initShare();
    }

} catch (e) {

}
//初始化参数 ,可以动态的改变
function initConfit(obj) {
    //通常都希望分享到朋友圈显示的文案为描述的文案 而不是标题
    window.shareWX.title = obj.title;
    window.shareWX.desc = obj.desc;
    window.shareWX.link = obj.link;
    window.shareWX.img_url = obj.image;
    window.shareWXTL.title = obj.desc; //朋友圈
    window.shareWXTL.desc = obj.desc;
    window.shareWXTL.link = obj.link;
    window.shareWXTL.img_url = obj.image;
    window.shareApp.title = obj.desc; //app到朋友圈显示标题应当是描述 
    window.shareApp.desc = obj.title + " " + obj.desc + obj.link; //为了适应6.8.5 分享到安卓微博的bug
    window.shareApp.url = obj.link;
    window.shareApp.image = obj.image;
}
//监听微信
function autoListenWx(shareWX, shareWXTL) {
    document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
        WeixinJSBridge.on('menu:share:appmessage', function(argv) {
            WeixinJSBridge.invoke('sendAppMessage', shareWX, function(res) {});
        });
        WeixinJSBridge.on('menu:share:timeline', function(argv) {
            WeixinJSBridge.invoke('shareTimeline', shareWXTL, function(res) {});
        });
    }, false);
}
//点击事件
function share_Wx_Dp_Attach(args) {
    function getQueryStringByName(name) {
        var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
        if (result == null || result.length < 1) {
            return "";
        }
        return result[1];
    }

    function is_notInDp() {
        var platform = getQueryStringByName('platform');
        if (platform == 'notindp') {
            return true;
        }
        return false;
    }

    function is_weixin() {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            return true;
        } else {
            return false;
        }
    }

    function isInDp() {
        var userAgent = window.navigator.userAgent.toLowerCase(),
            isInDp = !userAgent.match(/MicroMessenger/i);
        return isInDp;
    }

    function isInSina() {
        var userAgent = window.navigator.userAgent.toLowerCase(),
            isInSina = userAgent.match(/weibo/i);
        return isInSina;
    }

    function isInTenXun() {
        var userAgent = window.navigator.userAgent.toLowerCase(),
            isInTenXun = userAgent.match(/tencentmicroblog/i);
        return isInTenXun;
    }

    function sinaShare(c) {
        var pic = c.image;
        var url = 'http://v.t.sina.com.cn/share/share.php?appkey=1392673069&url=' + encodeURIComponent(c.url) + '&title=' + encodeURIComponent(c.title + c.desc) + '&content=utf-8' + '&pic=' + encodeURIComponent(pic);
        //window.open(url, '_blank');
        location.href = url;
    };

    function tengxunShare(c) {
        var pic = c.image;
        var url = 'http://share.v.t.qq.com/index.php?c=share&a=index&source=1000013&url=' + encodeURIComponent(c.url) + '&title=' + encodeURIComponent(c.title + c.desc) + '&content=utf-8' + '&pic=' + encodeURIComponent(pic);
        //window.open(url, '_blank');
        location.href = url;
    };


    function showShareTips(info) {
        var tips = $('<p></p>').css({
            'z-index': '999',
            'font-size': '13px',
            'line-height': '180%',
            'position': 'fixed',
            'width': document.documentElement.scrollWidth,
            'height': document.documentElement.clientHeight,
            'margin': 0,
            'padding': '40px 10px',
            'color': ' #fff',
            'background-color': 'rgba(0,0,0,.8)',
            'top': 0,
            'left': 0,
            'background-image': 'url(http://si1.s1.dpfile.com/t/cssnew/events/labevent/seefilm/mmimages/share-cover-tips.e3893cb7ee521914fd768d05fab419b3.png)',
            'background-repeat': 'no-repeat',
            '-webkit-background-size': '100% auto',
            'background-size': '100% auto'
        }).appendTo($('body'));
        if (info) {
            tips.html(info);
        }
        tips.on('click', function() {
            tips.remove();
        });
        setTimeout(function() {
            tips.remove();
        }, 3000);
    }
    if (is_weixin()) {
        showShareTips();
        return;
    }
    if (typeof WeixinJSBridge != 'undefined') {
        showShareTips();
        return;
    };
    if (isInSina()) {
        sinaShare(args);
        return;
    }
    if (isInTenXun()) {
        tengxunShare(args);
        return;
    }
    if (is_notInDp()) {
        return;
    }
    if (isInDp()) {
        args = (typeof args === 'object') ? JSON.stringify(args) : args + '';
        location.href = "js://_?method=share&args=" + encodeURIComponent(args);
    }
}