<template>
  <div id="bombbox">
    <div class="modal" id="modal" v-show="active">
      <div class="backdrop" v-if="active"></div>
      <transition enter-active-class="fadeInUp" leave-active-class="fadeOutDown">
        <div class="modal-body alert" v-show="active">
          <div class="icon"></div>
          <p>{{msg}}</p>
          <button type="button" class="btn btn-secondary confirm-button" @click="confirm">确定</button>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {

      }
    },

    props: {
      active: false,
      msg: ''
    },

    methods: {
      confirm () {
        this.$emit("on-bombbox-change")
      }
    }
  }
</script>
<style lang="less">
  #bombbox{
    .backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,.4);
      z-index: 65534
    }

   .modal-body {
      background-color: #fff;
      position: fixed;
      z-index: 65535;
      top: 30%;
      left: 50%;
      width: 72vw;
      margin-left: -36vw;
      border-radius: .5rem;
      animation-duration: .4s;
      animation-fill-mode: both;
      display: flex;
      flex-direction: column;
      padding: 1rem;
      align-items: center
    }

   .alert .icon {
      width: 50px;
      height: 50px;
      background: url(../images/icon_faill.png)  no-repeat;
      background-size: 100% 100%;
    }

   .alert p {
      text-align: center;
      margin-top: 0
    }

   .alert button {
      width: 6.5rem;
      background-color: #fff;
    }

    @keyframes fadeInUp {
      from {
          opacity: 0;
          transform: translate3d(0,100%,0)
      }

      to {
          opacity: 1;
          transform: none
      }
    }

    .fadeInUp {
        animation-name: fadeInUp
    }

    @keyframes fadeOutDown {
      from {
        opacity: 1
      }

      to {
        opacity: 0;
        transform: translate3d(0,100%,0)
      }
    }

    .fadeOutDown {
      animation-name: fadeOutDown
    }
  }
</style>

