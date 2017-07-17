import Vue from 'vue'

let bus = new Vue({
  data () {
    return {
      initData: {}
    }
  },

  methods: {
    getInitData () {
      // this.data = {name: '哈哈哈哈'}
      let _this = this

      return new Promise((resolve, reject) => {
        $.ajax({
          url: '/selfTemp/initData',
          type: 'GET',
          dataType: 'JSON',
          success: function(data) {
            if (data.state === 1) {
              _this.initData = data.data
            } else {
              alert(data.message)
            }
            resolve()
          },
          error: function(res) {
            reject('网络连接失败')
          }
        })
      })
    }
  }
})

export default bus