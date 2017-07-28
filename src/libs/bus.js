import Vue from 'vue'
import axios from 'axios'

let bus = new Vue({
  data () {
    return {
      initData: {},
      checkeAll: false,
      checkedDateList: [],
      total: 0,
      price: 0,
      couponPrice: 0,
      couponCodeRight: false,
      isFetching: true,
      contractId: '',
      levels: [{}],
      dateList: [],
      mobile: '',
      couponCode: '',
      couponStr: ''
    }
  },

  methods: {
    getInitData () {
      axios({
        url: API + '/initData',
        method: 'POST'
      })
      .then((res) => {
        if (res.data.state === 1) {
          this.initData = res.data.data
          this.contractId = this.initData.contract.contractId
          this.levels = this.initData.contract.levels
          this.total = this.initData.contract.price
          this.getDateList()
        } else {
          alert(data.message)
        }
      })
      .catch((res) => {
        console.log(res)
      })
    },

    getDateList () {
      let start = new Date(this.initData.startDate).getTime()
      let end = new Date(this.initData.endDate).getTime()
      let interval = 24 * 60 * 60 * 1000
      let month = -1
      let preMonth = -1

      for (let i = start; i <= end; i += interval) {
        preMonth = month
        month = new Date(i).getMonth()

        let showM = month
        if (month === preMonth) {
          // 是否显示月份，仅显示不同的月份
          showM = undefined
        } else {
          showM = month
        }

        let check = false
        if (i === start) {
          check = true
        } else {
          check = false
        }

        let obj = {
          checked: check,
          month: this.monthConvert(showM),
          day: new Date(i).getDate(),
          value: this.dateConvert(i)
        }

        this.dateList.push(obj)
      }

      this.checkedDateList.push(this.dateList[0].value)
      this.findContract()
    },

    findContract () {
      // 日期变更会触发本方法，但若日期为空时，其实不需要发送请求
      if (!this.checkedDateList || !this.checkedDateList.length) {
        // 重置默认值（参考原成功回调处理逻辑）
        this.price = 0;
        this.total = 0;
        this.contractId = '';
        this.levels = this.initData.contract.levels = [{}];

        return;
      }

      this.isFetching = true
      axios({
        url: API + '/findContract',
        method: 'POST',
        params: {
          cityId: this.initData.defaultCityId,
          dates: this.checkedDateList.join(',')
        }
      })
      .then((res) => {
        let data = res.data
        if (data.state === 1) {
          this.price = data.data.price
          this.contractId = data.data.contractId
          this.total = data.data.price - this.couponPrice
          this.levels = this.initData.contract.levels = data.data.levels
        } else {
          alert(data.message)
        }
        
        $("#loading-container").remove()
        this.isFetching = false
      })
      .catch((res) => {
        this.isFetching = false
      })
    },

    dateConvert (val) {
      if (val === undefined || val === null) return

      let year = new Date(val).getFullYear()
      let month = new Date(val).getMonth ()+ 1
      month = (month / 10 < 1) ? '0' + month : month
      let day = new Date(val).getDate()
      day = (day / 10 < 1) ? '0' + day : day

      return `${year}${month}${day}`
    },

    monthConvert (val) {
      if (val === undefined) return

      let month = [
        '一月', '二月', '三月', '四月', '五月', '六月',
        '七月', '八月', '九月', '十月', '十一月', '十二月'
      ]

      return month[val]
    }
  }
})

export default bus