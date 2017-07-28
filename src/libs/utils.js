import Vue from 'vue'

Vue.filter('priceConvert', (val) => {
  if (val != 0 && !val) return

  if (val < 0) return 0
  return (val / 100).toFixed(2)
})
// 为了给模版使用，添加一个负数检测（最小数值为0）
Vue.filter('makeGtEtZero', (val) => {
  return Math.max(val, 0);
})

Vue.filter('date', (val) => {
  if (!val || val.length < 1) return

  val = val.split(",")
  let res = []
  val.forEach((item) => {
    res.push(item.substr(5, 5))
  })

  return res.join(',')
  // if (res.length <= 3) {
  //   return res.join(',')
  // } else {
  //   return res.join(',').substr(0, 17) + '...'
  // }
})