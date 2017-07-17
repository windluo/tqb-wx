import Vue from 'vue'
import VueRouter from 'vue-router'
import loading from './components/loading'
import home from './biz/Homepage.vue'
import checkout from './biz/Checkout.vue'
import receipt from './biz/receipt.vue'
import faq from './biz/Faq.vue'
import Bus from './libs/bus.js'

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
		loading
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
	.catch((res) => {
		console.log(res)
	})
	.then((res) =>{
		$("#loading-container").remove()
	})