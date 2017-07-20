import Vue from 'vue'

Vue.filter('priceConvert', (val) => {
  if (val != 0 && !val) return

  return (val / 100).toFixed(2)
})