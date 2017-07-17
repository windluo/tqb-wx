<template>
  <div id="homepage">
    <header class="homepage-banner">
      <img :src="headerIMG">
    </header>
		<form id="buy" @submit.prevent="checkout">
      <div class="form-group">
        <input name="city" type="hidden" id="city" class="tqb-city-picker-input" @change="onCityChange">
        <label for="city" :data-url="api + 'getCitys'" data-hot="9" onclick="" class="tqb-city-picker-label">{{initData.defaultCityName}}</label>
      </div>
      <datepicker :date-list = "dateList" :on-date-change="onDateChange"></datepicker>
			<div class="header-help">
        <h4><i class="envelop"></i> 高温补贴标准</h4>
        <a href="#/faq" class="help">?</a>
      </div>
			
			<div class="subsidy-info">
				<p class="subsidy-header"><span class="big">35°</span><span>C</span>起赔，最高补贴金额<small>￥</small><span class="big">20</span><span>/天</span></p>
				<table class="subsidy-table">
					<tr>
						<th>触发标准</th>
						<th>赔偿金额</th>
					</tr>
					<tr>
						<td>35℃</td>
						<td>￥0.8/天</td>
					</tr>
					<tr>
						<td>36℃</td>
						<td>￥1.8/天</td>
					</tr>
					<tr>
						<td>37℃</td>
						<td>￥15/天</td>
					</tr>
				</table>
				<p class="help-block text-muted">
					高温补贴金额根据保障地当日最高气温达到的最高标准计算，气温数据
          以中国气象局{{initData.defaultCityName}}气象站（编号{{initData.defaultCityId}}）的温度实测值为准。
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
	import Bus from '../libs/bus.js'

	export default {
		data () {
			return {
				api: API,
				initData: Bus.initData,
				mobile: '',
				couponCode: '',
				total: 0,
				isFetching: false,
				isSubmitting: false,
				checkedDateList: [],
				dateList: [],
				active: false,
				msg: '',
				subsidyList: [],
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
			},

			getCity () {
				// axios.get(this.api + 'getCitys')
				// 	.then((res) => {
				// 		console.log(res)
				// 	})
				// 	.catch((res) => {
				// 		console.log(res)
				// 	})
			}
		},

		mounted () {
			document.title = '天气宝'
			this.createDateList()
			this.getCity()
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
			margin: .25rem 0 1.5rem
		}

		.text-muted {
			color: #999;
		}

		.subsidy-table{
			width: 100%;
			border-top: 1px solid #ccc;
			border-left: 1px solid #ccc;
			border-collapse: collapse;
			font-size: 12px;
			margin-top: .75rem;
			margin-bottom: .75rem;
			line-height: 2.4;

			th{
				font-weight: normal;
				background: #f5f5f5;
				border-right: 1px solid #ccc;
				border-bottom: 1px solid #ccc;
			}
			td{
				border-right: 1px solid #ccc;
				border-bottom: 1px solid #ccc;
				text-align: center;
			}
		}

		i.envelop{
			background: url(../images/icon_envelop.png) no-repeat;
			background-size: 100% 100%;
		}

		i.cart{
			background: url(../images/icon_cart.png) no-repeat;
			background-size: 100% 100%;
		}

		.tqb-city-picker-label:after {
			background: url(../images/icon_right_yel.png) no-repeat;
			background-size: 100% 100%;
		}
	}
</style>

