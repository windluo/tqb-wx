<template>
  <div id="checkout" class="bill">
    <dl class="detail">
      <dt>保障城市</dt>
      <dd>{{city}}</dd>
      <dt>保障开始时间</dt>
      <dd>{{start | date}}00:00</dd>
      <dt>保障结束时间</dt>
      <dd>{{end | date}}23:59</dd>
      <dt>补贴条件</dt>
      <dd>
        <p>任意单日{{product.label}}>{{product.threshold}}mm</p>
        <p><small>最终天气数据以{{city}}气象站（编号{{city_id}}）为准</small></p>
      </dd>
      <dt>最大补贴红包</dt>
      <dd>{{product.compensateRule * total_days}}元</dd>
    </dl>
    <dl class="count">
      <dt>手机号</dt>
      <dd><a href="javascript:void(0);" class="phone">{{mobile}}</a></dd>
      <dt>保障售价</dt>
      <dd class="price">{{product.price / 100}}元</dd>
      <dt>优惠码</dt>
      <dd class="discount">-{{coupon / 100}}元</dd>
      <dd class="final">实付：<span class="price">{{total}}元</span></dd>
    </dl>
    <footer>
      <button @click="onSubmit" :disabled="isSubmitting" class="btn btn-block btn-primary">确认支付</button>
    </footer>
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
        isSubmitting: false
      }
    },

    filters: {
      date (val) {
        return val.substr(0, 4) + '年' + val.substr(4, 2) + '月' + val.substr(6, 2) + '日'
      }
    },

    methods: {
      onSubmit () {
        if (this.isSubmitting) {
          return;
        }
        this.isSubmitting = true

        let _this = this
        setTimeout( () => {
          _this.isSubmitting = false
          _this.$router.push({path: '/receipt', query: {result: '1'}});
        }, 2000)
      }
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
