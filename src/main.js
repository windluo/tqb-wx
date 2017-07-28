import Vue from 'vue'
import VueRouter from 'vue-router'
import loading from './components/loading'
import shareImg from './components/shareImg'
import home from './biz/Homepage.vue'
import checkout from './biz/Checkout.vue'
import receipt from './biz/receipt.vue'
import faq from './biz/Faq.vue'
import Bus from './libs/bus.js'
import wxshare from './libs/wxshare'

import "./css/comm.css"
import 'tqb-component-city-picker/build/css/tqb-city-picker.min.css'
import 'tqb-component-city-picker/build/js/tqb-city-picker.min.js'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: 'home',
		component: home
	},
	{
		path: '/checkout',
		name: 'checkout',
		component: checkout 
	},
	{
		path: '/receipt',
		name: 'receipt',
		component: receipt
	},
	{
		path: '/faq',
		name: 'faq',
		component: faq
	}
]

const router = new VueRouter({
	routes
})

new Vue({
	router,
	data: {
		transitionName: ''
	},
	components: {
		loading, shareImg
	},
	watch: {
		'$route' (to, from) {
			if (to.name === 'faq') {
				this.transitionName = 'fade-in-up';
				return;
			}
			if (from.name === 'faq') {
				this.transitionName = 'fade-out-down';
				return;
			}

			let order = ['home', 'checkout', 'receipt'];
			to = order.indexOf(to.name);
			from = order.indexOf(from.name);
			this.transitionName = to < from ? 'slide-right' : 'slide-left';
		}
	}
}).$mount('#app')

Bus.getInitData()

/*微信分享*/
let share = {
	title: '天热？就领高温补贴',
	desc: '气温超过阈值，现金自动到账。',
	// link: 'http://app.baotianqi.cn/selftemp/#/',
	link: 'http://m.baotianqi.cn/self/index',
	imgUrl: 'http://app.baotianqi.cn/selftemp/images/share_img_8ef5b79b28f98530335262978cf2d3f5.jpg'
}
wxshare.getTicket(share)