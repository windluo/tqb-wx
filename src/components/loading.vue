<template>
  <div id="loading-container">
    <div id="loading">
      <p>加载中，请稍候</p>
      <div class="sk-wave">
        <div class="sk-rect sk-rect1"></div>
        <div class="sk-rect sk-rect2"></div>
        <div class="sk-rect sk-rect3"></div>
        <div class="sk-rect sk-rect4"></div>
        <div class="sk-rect sk-rect5"></div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      loadingStatus: true
    },

    methods: {
      checkLoading () {
        setTimeout(() => {
          if ($('#loading-container').length) {
            zhuge.track('init-error');
          }
        }, 60000);
      }
    },

    mounted () {
      // this.checkLoading()
    }
  }
</script>


<style lang="less">
  #loading-container{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    z-index: 99999;
  }
  #loading {
    padding-top: 40%;
    p {
      line-height: 3;
      text-align: center
    }

    .sk-wave .sk-rect {
      background-color: #fc6826
    }

    .sk-wave {
      margin: 40px auto;
      width: 50px;
      height: 40px;
      text-align: center;
      font-size: 10px
    }

    .sk-wave .sk-rect {
      background-color: #fc6826;
      height: 100%;
      width: 6px;
      display: inline-block;
      -webkit-animation: 1.2s ease-in-out infinite sk-waveStretchDelay;
      animation: 1.2s ease-in-out infinite sk-waveStretchDelay
    }

    .sk-wave .sk-rect1 {
      -webkit-animation-delay: -1.2s;
      animation-delay: -1.2s
    }

    .sk-wave .sk-rect2 {
      -webkit-animation-delay: -1.1s;
      animation-delay: -1.1s
    }

    .sk-wave .sk-rect3 {
      -webkit-animation-delay: -1s;
      animation-delay: -1s
    }

    .sk-wave .sk-rect4 {
      -webkit-animation-delay: -.9s;
      animation-delay: -.9s
    }

    .sk-wave .sk-rect5 {
      -webkit-animation-delay: -.8s;
      animation-delay: -.8s
    }

    @-webkit-keyframes sk-waveStretchDelay {
      0%,100%,40% {
          -webkit-transform: scaleY(.4);
          transform: scaleY(.4)
      }

      20% {
          -webkit-transform: scaleY(1);
          transform: scaleY(1)
      }
    }

    @keyframes sk-waveStretchDelay {
      0%,100%,40% {
          -webkit-transform: scaleY(.4);
          transform: scaleY(.4)
      }

      20% {
          -webkit-transform: scaleY(1);
          transform: scaleY(1)
      }
    }
  }
</style>
