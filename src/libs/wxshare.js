/*微信分享*/
import axios from 'axios'

var wxshare = {
  isready: false,

	getTicket: function(share){
    wxshare.wxReady(share);
    // console.log(share)

    axios({
      url: 'http://m.baotianqi.cn/weixin/getWxshare',
      method: 'POST',
      params: {
        // url: encodeURIComponent('m.baotianqi.cn')
        url: encodeURIComponent(location.href.split('#')[0])
      }
    })
    .then((res) => {
      if (res.data.state === 1) {
        wxshare.wxConfig(res);

        var timer = setInterval(function(){
          // console.log("wxisready：" + wxshare.isready)
          if(wxshare.isready){
            clearInterval(timer);
            return;
          }
          wxshare.wxConfig(res);
        }, 600);
      }
    })
    .catch((res) => {
      console.log(res)
    })
	},

  wxConfig: function(res){
    // console.log(res)
    wx.config({
      // debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: res.data.data.appId, // 必填，公众号的唯一标识
      timestamp: res.data.data.timestamp,
      nonceStr: res.data.data.nonceStr,
      signature: res.data.data.signature,
      jsApiList: ["onMenuShareQQ", "onMenuShareQZone", "onMenuShareWeibo", 'onMenuShareTimeline','onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });
  },

  wxReady: function(share){
    wx.ready(function(){
      wxshare.isready = true;
      // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
      wx.onMenuShareTimeline({
        title: share.title, // 分享标题
        link: share.link, // 分享链接
        imgUrl: share.imgUrl, // 分享图标
        success: function () { 
            // 用户确认分享后执行的回调函数
        },
        cancel: function () { 
            // 用户取消分享后执行的回调函数
        }
      });
      wx.onMenuShareAppMessage({
        title: share.title, // 分享标题
        desc: share.desc, // 分享描述
        link: share.link, // 分享链接
        imgUrl: share.imgUrl, // 分享图标
        type: '', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () { 
          // 用户确认分享后执行的回调函数
        },
        cancel: function () { 
          // 用户取消分享后执行的回调函数
        }
      });
      wx.onMenuShareQQ({
        title: share.title, // 分享标题
        desc: share.desc, // 分享描述
        link: share.link, // 分享链接
        imgUrl: share.imgUrl, // 分享图标
        success: function () { 
          // 用户确认分享后执行的回调函数
        },
        cancel: function () { 
          // 用户取消分享后执行的回调函数
        }
      });
      wx.onMenuShareQZone({
        title: share.title, // 分享标题
        desc: share.desc, // 分享描述
        link: share.link, // 分享链接
        imgUrl: share.imgUrl, // 分享图标
        success: function () { 
          // 用户确认分享后执行的回调函数
        },
        cancel: function () { 
          // 用户取消分享后执行的回调函数
        }
      });
      wx.onMenuShareWeibo({
        title: share.title, // 分享标题
        desc: share.desc, // 分享描述
        link: share.link, // 分享链接
        imgUrl: share.imgUrl, // 分享图标
        success: function () { 
          // 用户确认分享后执行的回调函数
        },
        cancel: function () { 
          // 用户取消分享后执行的回调函数
        }
      });
    });

    wx.error(function(res){
        wxshare.isready = true;
    })
  }
};

module.exports = wxshare;