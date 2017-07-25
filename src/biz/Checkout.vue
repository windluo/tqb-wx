<template>
  <div id="checkout" class="bill">
    <dl class="detail">
      <dt>保障城市</dt>
      <dd>{{orderData.city}}</dd>
      <dt>保障时间</dt>
      <dd>{{orderData.dates | date}}</dd>
      <dt>补贴条件</dt>
      <dd>
         <p>任意单日温度>{{minTemp}}℃</p> 
        <p><small>最终天气数据{{orderData.station}}</small></p>
      </dd>
      <dt>最大补贴红包</dt>
      <dd>{{orderData.maxPayout | priceConvert}}元</dd>
    </dl>
    <dl class="count">
      <dt>手机号</dt>
      <dd><a href="javascript:void(0);" class="phone">{{orderData.mobile}}</a></dd>
      <dt>保障售价</dt>
      <dd class="price">{{orderData.price | priceConvert}}元</dd>
      <dt>优惠码</dt>
      <dd class="discount">{{orderData.coupons}}</dd>
      <dd class="final">实付：<span class="price">{{(orderData.price-orderData.discountAmount) | priceConvert}}元</span></dd>
    </dl>
    <footer>
      <button @click="onSubmit" :disabled="isSubmitting" class="btn btn-block btn-primary">确认支付</button>
    </footer>
  </div>
</template>

<script>
  import Bus from '../libs/bus'
  import axios from 'axios'
  import '../libs/utils'

  export default {
    data () {
      return {
        contractId: '',
        orderIsOk: false,
        orderData: {},
        minTemp: '',
        total: '',
        isSubmitting: false
      }
    },

    methods: {
      onSubmit () {
        if (this.isSubmitting) {
          return;
        }

        this.isSubmitting = true
        this.payWxWap()
        // this.findOpenId()
      },

      checkOrder () {
        this.isSubmitting = true

        axios({
          url: API + '/checkOrder',
          method: 'POST',
          params: {
            contractId: this.contractId
          }
        })
        .then((res) => {
          if (res.data.state === 1) {
            this.orderIsOk = true
            this.findOrder()
          } else {
            this.orderIsOk = false
            alert(res.data.message)
            this.$router.push("/")
          }
        })
        .catch((res) => {
          console.log(res)
        })
      },

      findOrder () {
        axios({
          url: API + '/findOrder',
          method: 'POST',
          params: {
            contractId: this.contractId
          }
        })
        .then((res) => {
          if (res.data.state === 1) {
            this.orderData = res.data.data
            this.minTemp = this.orderData.threshold.split(":")[0]
            this.total = this.orderData.price - this.orderData.discountAmount
          } else {
            alert(res.data.message)
          }

          $("#loading-container").remove()
          this.isSubmitting = false
        })
        .catch((res) => {
          console.log(res)
        })
      },

      payWxWap(){
        if (!this.orderIsOk) return

        axios({
          method: "POST",
          url: toWxpay,
          params: {
            totalFee: this.total,
            outTradeNo: this.contractId,
            body: "高温保障",
            rUrl: encodeURIComponent('http://pay.baotianqi.cn/wxpay/wxpaysuccess/')
          }
        })
        .then((res) => {
          // let url = 'http://pay.baotianqi.cn/wxpay/test'
          // this.onBridgeReady(res.data)

          this.isSubmitting = false
        })
        .catch((res) => {
          console.log(res)
        })
      },
      
      onBridgeReady(result) {
        let _this = this

        WeixinJSBridge.invoke("getBrandWCPayRequest", {
          "appId": result.appId, // 公众号名称，由商户传入
          "timeStamp": result.timeStamp, // 时间戳，自1970年以来的秒数
          "nonceStr": result.nonceStr, // 随机串
          "package": result.package,
          "signType": result.signType, // 微信签名方式
          "paySign": result.paySign // 微信签名
        }, function(res) {
          if (res.errMsg == "get_brand_wcpay_request：ok") {
            // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
            // window.location.href = url;
            _this.$router.push({path: '/receipt', query: {contractId: _this.contractId}})
          }
        })
      }
    },

    mounted () {
      document.title = '确认订单'

      this.contractId = this.$route.query.contractId
      this.checkOrder()
    }
  }
</script>

<style lang="less">
  #checkout{
    .detail{
      position: relative;

      &:before{
        content: "";
        background: url(../images/icon003.jpg) no-repeat;
        height: 4px;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
      }
    }

    .discount,
    .phone {
      color: #f13a00;
      text-decoration: none
    }

    .price {
      color: #71b526
    }

    .final {
      font-size: 16px
    }

    dl:first-child {
      padding-top: 8px;
      border-top: .75rem solid #f2f2f2;
      border-bottom: .75rem solid #f2f2f2
    }

    dd:nth-child(n+3),
    dt:nth-child(n+3) {
      border-top: 1px solid #f0f0f0
    }

    footer{
      padding: 0 1rem;
    }
  }
</style>
