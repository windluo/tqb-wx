<template>
  <div id="datepicker">
		<div class="date-header">
			<i class="calendar"></i>
			 选择保障日期（可多选）
			<div class="date-checkall" :class="{checked:checked}" @click="checkAll">全选</div>
		</div>

		<ul class="date-list">
			<li class="date-item"
				:class="{checked:data.checked}"
				v-for="(data, $index) in dateList"
				@click="checkDate($index, data)"
			>
				<span class="date-item-first" v-if="$index==0">八月</span>
				{{data.value}}
			</li>
		</ul>
	</div>
</template>

<script>
	export default {
		data () {
			return {
				checked: false
			}
		},

		props: {
			dateList: {
				type: Array,
				default: []
			},
			onDateChange: {
				type: Function,
				default: Promise.resolve()
			}
		},
		
		methods: {
			checkAll () {
				this.checked = !this.checked
				
				if (!this.checked) {
					this.dateList.forEach( (item, i) =>  {
						this.dateList[i].checked = false	
					});
				} else {
					this.dateList.forEach( (item, i) =>  {
						this.dateList[i].checked = true	
					});
				}

				this.returnCheckedDate()
			},

			checkDate (index, data) {
				this.dateList[index].checked = !this.dateList[index].checked

				let len = 0
				this.dateList.forEach( (item) => {
					if (item.checked) {
						len++
					}
				})

				if (len === this.dateList.length) {
					this.checked = true
				} else {
					this.checked = false
				}

				this.returnCheckedDate()
			},

			returnCheckedDate () {
				let result = []

				this.dateList.forEach( (item) => {
					if (item.checked) {
						result.push(item)
					}
				})

				this.onDateChange(result)
			}
		},

		watch: {
			startDate () {
				let start = new Date(this.startDate).getTime()
				let end = new Date(this.endDate).getTime()
				let interval = 24 * 60 * 60 * 1000

				for (let i = this.startDate; i <= this.endDate; i += interval) {
					let date = new Date(i).getFullYear() + '-' + (new Date(i).getMonth() + 1) + '-' + new Date(i).getDate()
					console.log(date)
				}
			}
		}
	}
</script>

<style lang="less">
	#datepicker{
		.date-header{
			position: relative;
			.calendar{
				display: inline-block;
				width: 1.2rem;
				height: 1.2rem;
				vertical-align: top;
				background: url(../images/icon_date.png) no-repeat;
				background-size: 100% 100%;
			}

			.date-checkall{
				position: absolute;
				top: 0;
				right: 0;

				&:before{
					content: "";
					display: block;
					width: 1rem;
					height: 1rem;
					background: url(../images/icon_unchecked.png) no-repeat;
					background-size: 100% 100%;
					position: absolute;
					top: 0.2rem;
					left: -1.2rem;
				}
				&.checked:before{
					background: url(../images/icon_checked.png) no-repeat;
					background-size: 100% 100%;
				}
			}
		}

		.date-list{
			display: flex;
			flex-wrap: wrap;
			margin: 1em 0 1.5em;
			padding: 0;
			border-top: 1px solid #f5f5f5;
			border-left: 1px solid #f5f5f5;
			position: relative;

			.date-item-first{
				position: absolute;
				top: 2px;
				left: 1px;
				color: #666;
				display: inline;
				line-height: 1;
				font-size: 0.85rem;
			}
		}
		
		.date-item{
			list-style: none;
			min-width: 14.285714%;
			max-width: 14.29%;
			flex: 1 1 14.285714%;
			text-align: center;
			line-height: 40px;
			border-right: 1px solid #f5f5f5;
			border-bottom: 1px solid #f5f5f5;
			color: #fc6826;

			&.checked{
				color: #fff;
				background: #fc6826;
			}
		}
	}
</style>
