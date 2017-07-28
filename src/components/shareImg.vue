<template>
  <div>
    <div style="margin:0 auto;width:0px;height:0px;overflow:hidden">
      <img width="400" :src="imgUrl">
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      imgUrl: require('../images/share_img.jpg')
    }
  }
}
</script>
