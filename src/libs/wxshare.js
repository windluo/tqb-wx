/*微信分享*/
var wxshare = {
  isready: false,

	getTicket: function(vm){
    wxshare.wxReady(vm);

		vm.$http({url: ZD.config._DOMAIN.ticket, data:{url:encodeURIComponent(window.location.href)}, method: 'GET'}).then(function (response){
			if(response.data.code == 0){
        wxshare.wxConfig(response);

        //定时请求，防止注册失败
        //土是土了点，管用啊
        var timer = setInterval(function(){
          if(wxshare.isready){
            clearInterval(timer);
            return;
          }
          wxshare.wxConfig(response);
        }, 1000);
	    }
		}, function (response) {});
	},

  wxConfig: function(response){
    wx.config({
      // debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: response.data.data.appId, // 必填，公众号的唯一标识
      timestamp: response.data.data.timestamp,
      nonceStr: response.data.data.nonceStr,
      signature: response.data.data.signature,
      jsApiList: ["onMenuShareQQ", "onMenuShareQZone", "onMenuShareWeibo", 'onMenuShareTimeline','onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });
  },

  wxReady: function(vm){
    wx.ready(function(){
      wxshare.isready = true;
      // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
      wx.onMenuShareTimeline({
        title: vm.wxshare.title, // 分享标题
        link: vm.wxshare.link, // 分享链接
        imgUrl: vm.wxshare.imgUrl, // 分享图标
        success: function () { 
            // 用户确认分享后执行的回调函数
          if(vm.wxshareback && vm.wxshareback){
              vm.$broadcast('wxshareback');
          }
        },
        cancel: function () { 
            // 用户取消分享后执行的回调函数
        }
      });
      wx.onMenuShareAppMessage({
        title: vm.wxshare.title, // 分享标题
        desc: vm.wxshare.desc, // 分享描述
        link: vm.wxshare.link, // 分享链接
        imgUrl: vm.wxshare.imgUrl, // 分享图标
        type: '', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () { 
          // 用户确认分享后执行的回调函数
          if(vm.wxshareback && vm.wxshareback){
            vm.$broadcast('wxshareback');
          }
        },
        cancel: function () { 
          // 用户取消分享后执行的回调函数
        }
      });
      wx.onMenuShareQQ({
        title: vm.wxshare.title, // 分享标题
        desc: vm.wxshare.desc, // 分享描述
        link: vm.wxshare.link, // 分享链接
        imgUrl: vm.wxshare.imgUrl, // 分享图标
        success: function () { 
          // 用户确认分享后执行的回调函数
        },
        cancel: function () { 
          // 用户取消分享后执行的回调函数
        }
      });
      wx.onMenuShareQZone({
        title: vm.wxshare.title, // 分享标题
        desc: vm.wxshare.desc, // 分享描述
        link: vm.wxshare.link, // 分享链接
        imgUrl: vm.wxshare.imgUrl, // 分享图标
        success: function () { 
          // 用户确认分享后执行的回调函数
        },
        cancel: function () { 
          // 用户取消分享后执行的回调函数
        }
      });
      wx.onMenuShareWeibo({
        title: vm.wxshare.title, // 分享标题
        desc: vm.wxshare.desc, // 分享描述
        link: vm.wxshare.link, // 分享链接
        imgUrl: vm.wxshare.imgUrl, // 分享图标
        success: function () { 
          // 用户确认分享后执行的回调函数
        },
        cancel: function () { 
          // 用户取消分享后执行的回调函数
        }
      });
      wx.chooseWXPay({
        timestamp: 0, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
        nonceStr: '', // 支付签名随机串，不长于 32 位
        package: '', // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
        signType: '', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
        paySign: '', // 支付签名
        success: function (res) {
            // 支付成功后的回调函数
        }
      });
    });

    wx.error(function(res){
        wxshare.isready = true;
    })
  }
};

module.exports = wxshare;