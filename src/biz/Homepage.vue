<template>
  <div id="homepage">
    <header class="homepage-banner">
      <img :src="headerIMG">
    </header>
		<form id="buy" @submit.prevent="checkout">
      <div class="form-group">
        <input name="city" type="hidden" id="city" class="tqb-city-picker-input" @change="onCityChange">
        <label for="city" :data-url="api + '/getCitys'" data-hot="9" onclick="" class="tqb-city-picker-label">{{initData.defaultCityName}}</label>
      </div>
      <datepicker :on-date-change="onDateChange"></datepicker>
			<div class="header-help">
        <h4><i class="envelop"></i> 高温补贴标准</h4>
        <a href="#/faq" class="help">?</a>
      </div>
			
			<div class="subsidy-info">
				<p class="subsidy-header">
					<span class="big">{{minTemp}}°</span><span>C</span>起赔，
					最高补贴金额<small>￥</small><span class="big">{{maxPay | priceConvert}}</span><span>/天</span>
				</p>
				<table class="subsidy-table">
					<tr>
						<th>触发标准</th>
						<th>赔偿金额</th>
					</tr>
					<tr v-for="data in levels">
						<td>{{data.threshold}}℃</td>
						<td>￥{{data.payout | priceConvert}}/天</td>
					</tr>
				</table>
				<p class="help-block text-muted">
					高温补贴金额根据保障地当日最高气温达到的最高标准计算，气温数据
          以中国气象局{{initData.defaultCityName}}气象站（编号{{initData.defaultCityId}}）的温度实测值为准。
        </p>
			</div>
      <h4 class="buy-info"><i class="cart"></i> 购买人信息</h4>
      <div class="form-group">
        <input type="tel" name="mobile" class="form-control" placeholder="您的手机号码，必填~" id="mobile" v-model="mobile" maxlength="11">
        <label class="required" for="mobile"></label>
      </div>
			<div class="form-group">
        <input type="text" name="couponCode" class="form-control" placeholder="优惠码，可不填~" @keyup="findCoupons" id="couponCode" v-model="couponCode">
        <label class="tips" for="couponCode">{{couponStr}}</label>
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
          需支付：<span class="price">{{total | priceConvert}}元</span>
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
	import axios from 'axios'
	import '../libs/utils'

	export default {
		data () {
			return {
				api: API,
				mobile: Bus.mobile,
				couponCode: Bus.couponCode,
				couponCodeRight: false,
				couponStr: '',
				isSubmitting: false,
				checkedDateList: Bus.checkedDateList,
				active: false,
				msg: '',
				subsidyList: [],
				headerIMG: require('../images/header.jpg'),
				introIMG: require('../images/intro.jpg')
			}
		},

		computed: {
			initData () {
				return Bus.initData
			},

			isFetching () {
				return Bus.isFetching
			},

			contract () {
				return Bus.initData.contract || {}
			},

			levels () {
				return this.contract.levels || [{}]
			},

			minTemp () {
				return this.levels[0].threshold
			},

			maxPay () {
				return this.levels[this.levels.length-1].payout
			},

			total () {
				return Bus.total
			},

			couponPrice () {
				return Bus.couponPrice
			},

			contractId () {
				return Bus.contractId
			}
		},

		watch: {
			mobile (val, oldval) {
				Bus.mobile = val
			},

			couponCode (val, oldval) {
				Bus.couponCode = val
			}
		},

		components: {
			datepicker, bombbox
		},

		methods: {
			onCityChange (event) {
				let cityName = this.$el.querySelector(`[for=${event.target.id}]`).textContent;
			
				this.city = Bus.initData.defaultCityName = cityName
				this.city_id = Bus.initData.defaultCityId = event.target.value
				Bus.findContract()

				zhuge.track('city', {
					id: event.target.value
				});
			},

			onDateChange (date) {
				this.checkedDateList = Bus.checkedDateList = date
				Bus.findContract()
			},

			findCoupons () {
				if (!this.mobile) {
					this.msg = '请填写手机号码'
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

				if (this.couponCode.length < 5) {
					return
				}

				axios({
					url: API + '/findCoupons',
					method: 'POST',
					params: {
						coupons: this.couponCode,
						mobile: this.mobile
					}
				})
				.then((res) => {
					if (res.data.state === 1) {
						console.log(res.data.data)
						Bus.couponPrice = res.data.data
						this.couponStr = `优惠码有效，立减${(Bus.couponPrice/100).toFixed(2)}元`
						Bus.total -= Bus.couponPrice
						this.couponCodeRight = true
					} else {
						this.couponStr = `优惠码无效`
						this.couponCodeRight = false
						Bus.total += Bus.couponPrice
						Bus.couponPrice = 0
					}
				})
				.catch((res) => {
					this.couponStr = `优惠码无效`
					this.couponCodeRight = false
					Bus.total += Bus.couponPrice
					Bus.couponPrice = 0
					console.log(res)
				})
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
				// if (this.couponCode) {
				// 	let reg = /^[A-Za-z0-9]{8}$/

				// 	if (!reg.test(this.couponCode)) {
				// 		this.msg = '请填写正确的优惠码'
				// 		this.active = true
				// 		return
				// 	}
				// }

				this.isSubmitting = true
				let data = {
					contractId: this.contractId,
					payFee: this.total,
					mobile: this.mobile
				}

				if (this.couponCode && this.couponCodeRight) {
					data.coupon = this.couponCode
				} else {
					delete data.coupon
					this.couponCode = Bus.couponCode = ''
				}

				axios({
					url: API + '/addOrder',
					method: 'POST',
					params: data
				})
				.then((res) => {
					if (res.data.state === 1) {
						this.$router.push({
							path: 'checkout',
							query: {
								contractId: this.contractId
							}
						})
					} else {
						this.msg = res.data.message
						this.active = true
					}

					this.isSubmitting = false
				})
				.catch((res) => {
					console.log(res)
				})
			}
		},

		mounted () {
			document.title = '天气宝'
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

