<template>
  <div id="receipt" class="bill">
    <header>
      <div v-if="paySuccess">
        <h3 class="success"><i class="icon-ok-circled2"></i> 购买成功</h3>
        <p class="lead">手机号码：{{receiptData.mobile}}</p>
        <p class="red-info">
          <span class="red">重要！请一定关注天气宝微信号（tianqibao2015)，</span>才能领取天气补贴红包，红包将在保障期结束后，通过微信自动转给联系人
        </p>
        <div class="btn-group">
          <a href="#/" class="btn btn-primary" @click="restart">再次购买</a>
          <a href="#/" class="btn btn-primary share-button" @click.prevent="share">分享</a>
        </div>
        <div id="share-container" v-if="isShare">
          <div class="share-b"></div>
          <div class="share" @click="hideShare"></div>
        </div>
      </div>
      <div v-else>
        <h3 class="error"><i class="icon-cancel-circled-outline"></i> 购买失败</h3>
        <p class="lead">用户取消购买或支付失败</p>
        <p>
          <a href="#/" class="btn btn-primary btn-block" @click="restart">再次购买</a>
        </p>
      </div>
    </header>
    <div class="bar"></div>
    <dl>
      <dt>保障城市</dt>
      <dd>{{receiptData.city}}</dd>
      <dt>保障时间</dt>
      <dd>{{receiptData.dates | date}}</dd>
      <dt>订单金额</dt>
      <dd>{{receiptData.price | priceConvert}}元</dd>
      <dt>保障金额</dt>
      <dd>每日赔付元，共计元</dd>
      <dt>补贴条件</dt>
      <dd>任意单日温度>{{minTemp}}mm</dd>
      <dt>手机号</dt>
      <dd><a href="javascript:void(0);" class="phone">{{receiptData.mobile}}</a></dd>
      <dt>站点信息</dt>
      <dd>{{receiptData.station}}</dd>
    </dl>
  </div>
</template>

<script>
  import axios from 'axios'
  import '../libs/utils'
  
  export default {
    data () {
      return {
        receiptData: {},
        minTemp: '',
        paySuccess: true,
        isShare: false
      }
    },

    methods: {
      restart () {

      },

      share () {
        this.isShare = true
      },

      hideShare () {
        this.isShare = false
      },

      checkOrder () {
        let id = this.$route.query.contractId
        if (!id) return

        axios({
          url: API + '/findOrder',
          method: 'POST',
          params: {
            contractId: id
          }
        })
        .then((res) => {
          if (res.data.state === 1) {
            this.receiptData = res.data.data
            this.minTemp = this.receiptData.threshold.split(":")[0]
            this.paySuccess = true
            document.title = '购买成功'
          } else {
            this.paySuccess = false
            document.title = '购买失败'
          }

          $("#loading-container").remove()
        })
        .catch((res) => {
          this.paySuccess = false
          document.title = '购买失败'
          console.log(res)
        })
      }
    },

    mounted () {
      this.checkOrder()
    }
  }
</script>

<style lang="less">
  #receipt{
    header {
      text-align: center;
    }

    .btn {
      padding-top: 0.75rem;
      padding-bottom: 0.75rem;
    }

    p {
      font-size: 0.85rem;
    }

    .btn-group {
      display: flex;
      margin-top: 0.5em;
      margin-bottom: 0.5em;

      .btn {
        flex: 1;
        &:first-child {
          margin-right: 10px;
        }
      }
    }

    .bar {
      height: 10px;
      background-color: #f2f2f2;
      border-top: 1px dashed #ddd;
      border-bottom: 1px dashed #ddd;
    }

    .phone {
      color: #333;
    }

    .red-info {
      color: #999;
      .red {
        color: #f13a00;
      }
    }
    
    .icon-ok-circled2,
    .icon-cancel-circled-outline{
      display: inline-block;
      width: 2rem;
      height: 2rem;
      vertical-align: bottom;
    }

    .icon-ok-circled2{
      background: url(../images/icon001.png) no-repeat;
      background-size: 100% 100%;
    }

    .icon-cancel-circled-outline{
      background: url(../images/icon002.png) no-repeat;
      background-size: 100% 100%;
    }

    #share-container{
      width: 100%;
      height: 100%;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 999;
      .share-b{
        width: 100%;
        height: 100%;
        background: #000;
        opacity: 0.3;
      }
      .share{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 10;
        background: url(../images/share.png) no-repeat;
        background-size: 100% 100%;
      }
    }
  }
</style>
