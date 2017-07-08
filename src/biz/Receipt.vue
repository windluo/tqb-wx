<template>
  <div id="receipt" class="bill">
    <header>
      <div v-if="paySuccess">
        <h3 class="success"><i class="icon-ok-circled2"></i> 购买成功</h3>
        <p class="lead">手机号码：{{mobile}}</p>
        <p class="red-info">
          <span class="red">重要！请一定关注天气宝微信号（tianqibao2015)，</span>才能领取天气补贴红包，红包将在保障期结束后，通过微信自动转给联系人
        </p>
        <div class="btn-group">
          <a href="#/" class="btn btn-primary" @click="restart">再次购买</a>
          <a href="#/" class="btn btn-primary share-button" @click.prevent="share">分享</a>
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
      <dd>{{city}}</dd>
      <dt>保障开始时间</dt>
      <dd>{{start | date}}00:00</dd>
      <dt>保障结束时间</dt>
      <dd>{{end | date}}23:59</dd>
      <dt>订单金额</dt>
      <dd>{{total}}元</dd>
      <dt>保障金额</dt>
      <dd>每日赔付{{product.compensateRule}}元，共计{{total_days * product.compensateRule}}元</dd>
      <dt>补贴条件</dt>
      <dd>任意单日{{product.label}}>{{product.threshold}}mm</dd>
      <dt>手机号</dt>
      <dd><a href="javascript:void(0);" class="phone">{{mobile}}</a></dd>
      <dt>站点信息</dt>
      <dd>以{{city}}气象站（编号{{city_id}}）为准</dd>
    </dl>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        city: '深圳',
        city_id: 'CN59493',
        start: '20170310',
        end: '20170310',
        product: {},
        total_days: 1,
        total: '',
        mobile: '18526521454',
        coupon: '',
        paySuccess: true
      }
    },

    filters: {
      date (val) {
        return val.substr(0, 4) + '年' + val.substr(4, 2) + '月' + val.substr(6, 2) + '日'
      }
    },

    methods: {
      restart () {

      },

      share () {
        console.log('点击右上角分享')
      }
    },

    mounted () {
      console.log(this.$route.query)
      if (this.$route.query.result == 1) {
        this.paySuccess = true
      } else {
        this.paySuccess = false
      }
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
  }
</style>
