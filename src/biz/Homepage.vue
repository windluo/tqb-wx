<template>
  <div id="homepage">
    <header class="homepage-banner">
      <img :src="headerIMG">
    </header>
		<form id="buy" @submit.prevent="checkout">
      <div class="form-group">
        <input name="city" type="hidden" id="city" class="tqb-city-picker-input" @change="onCityChange">
        <label for="city" :data-url="api + 'getCitys'" data-hot="9" onclick="" class="tqb-city-picker-label">{{city}}</label>
      </div>
      <datepicker :date-list = "dateList" :on-date-change="onDateChange"></datepicker>
			<div class="header-help">
        <h4><i class="envelop"></i> 高温补贴标准</h4>
        <a href="#/faq" class="help">?</a>
      </div>
			
			<div class="subsidy-info">
				<p class="subsidy-header"><span class="big">35°</span><span>C</span>起赔，最高补贴金额<span class="big">20</span><span>/天</span></p>
				<ul class="subsidy-list">
					<li class="subsidy-item header">触发标准</li>
					<li class="subsidy-item header">赔偿金额</li>
					<li class="subsidy-item">35℃</li>
					<li class="subsidy-item">￥0.8/天</li>
					<li class="subsidy-item">36℃</li>
					<li class="subsidy-item">￥1.8/天</li>
					<li class="subsidy-item">37℃</li>
					<li class="subsidy-item">￥15/天</li>
				</ul>
				<p class="help-block text-muted">
					以达到最高档为准<br>
          最终天气实测值以中国气象局{{city}}气象站（编号{{city_id}}）为准。
        </p>
			</div>
      <h4 class="buy-info"><i class="cart"></i> 购买人信息</h4>
      <div class="form-group">
        <input type="tel" name="mobile" class="form-control" placeholder="您的手机号码，必填~" id="mobile" @change="onMobileChange" v-model="mobile" maxlength="11">
        <label class="required" for="mobile"></label>
      </div>
			<div class="form-group">
        <input type="text" name="couponCode" class="form-control" placeholder="优惠码，可不填~" id="couponCode" @change="onCouponCodeChange" v-model="couponCode" maxlength="8">
        <label class="tips" for="couponCode">优惠码有效，立减5元</label>
      </div>
    </form>
		<div class="how-to-play">
      <img :src="introIMG">
    </div>
		<footer class="cart">
      <div class="total">
        <div v-if="isFetching">
          <span class="text-muted">计算中...</span>
        </div>
        <div v-else>
          需支付：<span class="price">{{total}}元</span>
        </div>
      </div>
      <button form="buy" class="btn btn-primary" :disabled="isFetching || isSubmitting">
        <i v-if="isSubmitting" class="spinner"></i> 立即支付
      </button>
    </footer>
		<bombbox :active="active" :msg="msg" @on-bombbox-change="onBombBoxChange"></bombbox>
  </div>
</template>

<script>
	import datepicker from "../components/datePicker"
	import bombbox from '../components/bombBox'

	export default {
		data () {
			return {
				api: 'http://test.baotianqi.cn/moji/',
				city: '深圳',
				city_id: 'CN59493',
				mobile: '',
				couponCode: '',
				total: 0,
				isFetching: false,
				isSubmitting: false,
				dateList: [],
				checkedDateList: [],
				active: false,
				msg: '',
				headerIMG: require('../images/header.jpg'),
				introIMG: require('../images/intro.jpg')
			}
		},

		components: {
			datepicker, bombbox
		},

		methods: {
			onCityChange (event) {
				let cityName = this.$el.querySelector(`[for=${event.target.id}]`).textContent;
				// this.$store.commit(MutationTypes.SET_CITY, {
				// 	id: event.target.value,
				// 	cityName: cityName
				// });

				this.city = cityName;
				this.city_id = event.target.value;

				zhuge.track('city', {
					id: event.target.value
				});
			},

			onMobileChange () {

			},

			onCouponCodeChange () {

			},

			onDateChange (date) {
				this.checkedDateList = date

				//选完日期，去后台计算需支付的价钱
				this.isFetching = true
				let _this = this
				setTimeout(()=> {
					_this.isFetching = false
					_this.total = _this.checkedDateList.length * 2
				}, 2000)
			},

			createDateList () {
				for (let i = 0; i < 14; i++) {
					let obj = {
						checked: false,
						value: i + 11
					}

					this.dateList.push(obj)
				}
			},

			onBombBoxChange () {
				this.active = false
				this.msg = ''
			},

			checkout () {
				if (this.checkedDateList.length === 0) {
					this.msg = '请选择保障日期'
					this.active = true
					return
				}
				if (!this.mobile) {
					this.msg = '请填写正确的手机号码'
					this.active = true
					return
				} else {
					let reg = /^1[34578]\d{9}$/

					if (!reg.test(this.mobile)) {
						this.msg = '请填写正确的手机号码'
						this.active = true
						return
					}
				}
				if (this.couponCode) {
					let reg = /^[A-Za-z0-9]{8}$/

					if (!reg.test(this.couponCode)) {
						this.msg = '请填写正确的优惠码'
						this.active = true
						return
					}
				}

				this.isSubmitting = true
				let data = {
					date: this.checkedDateList,
					mobile: this.mobile,
					couponCode: this.couponCode
				}
				console.log(data)

				let _this = this
				setTimeout(()=> {
					_this.isSubmitting = false
					this.$router.push('checkout')
				}, 2000)
			}
		},

		mounted () {
			this.createDateList()
		}
	}
</script>

<style lang="less">
	#homepage{
		.homepage-banner {
			position: absolute;
			height: 15rem;
			top: 0;
			left: 0;
			right: 0;
			z-index: 10;

			img{
				width: 100%;
			}
		}

		.how-to-play {
			background-color: #ddd;
			min-height: 10rem;
			padding-bottom: 50px
		}

		.how-to-play img {
			width: 100%;
			display: block
		}

		footer.cart {
			background-color: #fff;
			display: flex;
			line-height: 50px;
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: 100
		}

		footer.cart .total {
			flex: 1;
			padding-left: 2rem;
			box-shadow: inset 0 1px 0 #e6e6e6
		}

		footer.cart .price {
			color: #fc6826
		}

		footer.cart button {
			width: 150px;
			height: 50px;
			background-color: #fc6826;
			border: none;
			border-radius: 0;
			padding: 0;

			&:disabled{
				background-color: #f98958;
			}
		}

		.subsidy-header{
			margin: 0;

			span{
				color: #fc6826;
				&.big{
					font-size: 20px;
				}
			}
		}

		.subsidy-info .help-block {
			font-size: .75rem;
			margin: .25rem 0 1rem
		}

		.text-muted {
			color: #999;
		}

		.subsidy-list{
			overflow: hidden;
			border-top: 1px solid #ccc;
			border-left: 1px solid #ccc;
			font-size: 12px;
			margin-top: 1rem;
			margin-bottom: .75rem;

			.subsidy-item{
				float: left;
				flex-direction: column;
				justify-content: center;
				line-height: 2.4;
				width: 50%;
				text-align: center;
				margin-bottom: 0;
				border-right: 1px solid #ccc;
				border-bottom: 1px solid #ccc;

				&.header{
					background: #f5f5f5;
				}
			}
		}
	}
</style>

