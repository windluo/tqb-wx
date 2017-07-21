import Vue from 'vue'

Vue.filter('priceConvert', (val) => {
  if (val != 0 && !val) return

  return (val / 100).toFixed(2)
})

Vue.filter('date', (val) => {
  if (!val || val.length < 1) return

  val = val.split(",")
  let res = []
  val.forEach((item) => {
    res.push(item.substr(5, 5))
  })
console.log(res)
  if (res.length <= 3) {
    return res.join(',')
  } else {
    return res.join(',').substr(0, 17) + '...'
  }
})