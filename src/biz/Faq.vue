<template>
  <div id="faq">
    <header>
      <a href="#/"><i class="icon-left"></i></a>
			<a class="a-close" href="#/">关闭</a>
      <h3>常见问题</h3>
    </header>
		<h3 class="normal">常见问题</h3>
    <dl>
      <dt>赔付方式是什么？</dt>
      <dd>天气宝通过微信零钱转账的方式进行赔付。赔付前，需要您在微信中绑定您账户。如果未绑定账户，则赔付无法发送给您。</dd>
      <dt>怎么绑定账户？</dt>
      <dd>关注天气宝微信服务号（tianqibao2015），在菜单中选择“绑定”，验证手机号通过后，即完成绑定。</dd>
      <dt>不同天气的触发标准会变动吗？</dt>
      <dd>是的，随着天气的变化，触发标准也会出现变动。</dd>
      <dt>我什么时候会知道购买的合约是否触发？</dt>
      <dd>您购买的合约结束时，我们会通过给您发送微信消息（如果没有关注天气宝微信号，则会发短信给您），告知您气象台的实测值以及是否触发。由于气象台的数据有一定延迟，我们拿到数据后3个工作日内发送触发消息。</dd>
      <dt>我认为你们的数据不太对，我在天气预报上看到的不是这个？</dt>
      <dd>天气指数的判定，以国家气象局发布的该气象站点的天气指标实测值为准，该指标可在中央气象台网站（http://www.nmc.cn）通过5位站点编号查询。其他细节，请参考<a class="a-href" href="http://m.baotianqi.cn/help/protect_agreement">《天气宝用户服务协议》</a>。</dd>
      <dt>怎么查询我购买的合约？</dt>
      <dd>在天气宝微信服务号中，您能查询到您购买的合约以及合约的各种状态。</dd>
      <dt>购买后，我想退订单可不可以？</dt>
      <dd>购买后，您无法退订单，非常抱歉。</dd>
    </dl>
    <h3 class="normal">规则详情</h3>
    <ol>
      <li>保障日期下对应天气指标，如果实际值达到指标要求，即可获得赔付</li>
      <li>温度的统计周期为当日0：00至当日23：59</li>
      <li>降水的统计周期为当日0：00至当日23：59</li>
      <li>天气指标实际值以中国气象局发布的投保城市的国家级标准站数据为准</li>
      <li>每个城市或者地区的天气指标以该地区特定的气象观测站的观测值为准，详见<a class="a-href" href="http://m.baotianqi.cn/to/protect_cityMassage">《城市和气象站点列表》</a></li>
    </ol>
  </div>
</template>

<style lang="less">
  #faq{
    header {
			background-color: #333;
			color: #fff;
			line-height: 3em;
			position: relative;

			a {
				color: #fff;
				position: absolute;
				top: 0;
				left: 0;
				width: 3rem;
				height: 100%;
				text-align: center;
				text-decoration: none;

				&.a-close{
					left: 3rem;
				}

				.icon-left{
					display: block;
					width: 100%;
					height: 100%;
					background: url(../images/icon_left.png) no-repeat;
					background-size: 100% 100%;
				}
			}

			h3 {
				margin: 0
			}
		}

		h3 {
			text-align: center;
			&.normal{
				font-weight: 500;
			}
		}

		dl {
			padding: 0 1.5rem;
			border-bottom: .75rem solid #f2f2f2;
			margin-bottom: 0;
		}

		dd, dt {
    	margin-left: 1.7rem;
   	 	text-indent: -1.6rem;
			
			&:before{
				font-family: Courier,Consolas;
			}
		}

		dt:before {
    	content: 'Q：'
		}

		dd {
    	color: #666;
    	margin-bottom: 1.5rem;

			&:before {
				content: 'A：'
			}
		}

		ol {
			margin: 0;
			padding: 0 1.5rem 0 2.5rem;

			li{
				margin-bottom: 1rem
			}
		}

		a.a-href{
			color: #4a90e2;
			text-decoration: none;
		}
  }
</style>

