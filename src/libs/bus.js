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
      let _this = this

      axios({
        url: API + '/initData',
        method: 'POST'
      })
      .then((res) => {
        if (res.data.state === 1) {
          _this.initData = res.data.data
          _this.contractId = _this.initData.contract.contractId
          _this.levels = _this.initData.contract.levels
          _this.total = _this.initData.contract.price
          _this.getDateList()
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
      this.isFetching = true
      let _this = this
      axios({
        url: API + '/findContract',
        method: 'POST',
        params: {
          cityId: _this.initData.defaultCityId,
          dates: _this.checkedDateList.join(',')
        }
      })
      .then((res) => {
        let data = res.data
        if (data.state === 1) {
          _this.price = data.data.price
          _this.contractId = data.data.contractId
          _this.total = data.data.price - _this.couponPrice
          _this.levels = _this.initData.contract.levels = data.data.levels
        } else {
          alert(data.message)
        }
        
        $("#loading-container").remove()
        _this.isFetching = false
      })
      .catch((res) => {
        _this.isFetching = false
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