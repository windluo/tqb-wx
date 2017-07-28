<template>
  <div id="checkout" class="bill">
    <dl class="detail">
      <dt>保障城市</dt>
      <dd>{{orderData.city}}</dd>
      <dt>保障日期</dt>
      <dd>
        <div class="date-det">
          {{orderData.dates | date}}
        </div>
      </dd>
      <dt>补贴条件</dt>
      <dd>
         <p>任意单日温度>{{minTemp}}℃</p> 
        <p class="text-nowrap"><small>最终天气数据{{orderData.station}}</small></p>
      </dd>
      <dt>最大补贴红包</dt>
      <dd>{{orderData.maxPayout | priceConvert}}元</dd>
    </dl>
    <dl class="count">
      <dt>手机号</dt>
      <dd><a href="javascript:void(0);" class="phone">{{orderData.mobile}}</a></dd>
      <dt>保障售价</dt>
      <dd class="price">{{orderData.price | priceConvert}}元</dd>
      <dt>优惠金额</dt>
      <dd class="discount">{{orderData.discountAmount | priceConvert}}元</dd>
      <dd class="final">实付：<span class="price">{{(orderData.price-orderData.discountAmount) | makeGtEtZero | priceConvert}}元</span></dd>
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
        //确认支付，先提交订单，再去支付
        this.addOrder()
      },

      addOrder () {
        axios({
          url: API + '/addOrder',
          method: 'POST',
          params: {
            contractId: this.contractId,
            payFee: (this.total < 0) ? 0 : this.total
          }
        })
        .then((res) => {
          if (res.data.state === 1) {
            if (this.total <=0 ) {
              this.$router.push({
                path: 'receipt',
                query: {
                  contractId: this.contractId
                }
              })
            } else {
              let rUrl = encodeURIComponent('http://app.baotianqi.cn/selftemp/#/receipt?contractId=' + this.contractId)
              let url = ''

              if (this.isWeixin()) {
                url = 'http://m.baotianqi.cn/self/toWxpay?'
              } else {
                url = 'http://pay.baotianqi.cn/alipay/pay?'
              }
              
              let target = url
                        + 'outTradeNo=' + this.contractId
                        + '&totalFee=' + this.total
                        + '&body=temp'
                        + '&rUrl=' + rUrl

              window.location.href = target
            }
          } else {
            alert(res.data.message)
          }

          this.isSubmitting = false
        })
        .catch((res) => {
          console.log(res)
        })
      },

      isWeixin () {
        var ua = window.navigator.userAgent.toLowerCase()
        if(ua.match(/MicroMessenger/i) == 'micromessenger'){ 
          return true
        }

        return false
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
            this.findContracCache()
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

      findContracCache () {
        axios({
          url: API + '/findContracCache',
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
    .date-det{
      line-height: 1.5;
      margin-top: 0.6rem;
      margin-bottom: 0.6rem;
    }
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
