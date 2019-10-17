<template>
  <div>
    <div class="modal" style="display:flex; height:100vh">
      <div class="modal-background"></div>
      <div class="modal-card" style="margin:0">
        <header class="modal-card-head">
          <slot name="header">
            <p class="modal-card-title">Modal title</p>
          </slot>
          <button class="delete" aria-label="close" @click="$emit('close')"></button>
        </header>
        <section class="modal-card-body">
          <slot name="body">
            default body
          </slot>
        </section>
        <footer class="modal-card-foot">
          <slot name="footer">
            <button class="button" @click="$emit('close')">Cancel</button>
          </slot>
        </footer>
      </div>
    </div>
    <!-- <transition name="modal">
       <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">

          <div class="modal-header">
            <slot name="header">
              default header
            </slot>
          </div>

          <div class="modal-body">
            <slot name="body">
              default body
            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              default footer
              <button class="modal-default-button" @click="$emit('close')">
                OK
              </button>
            </slot>
          </div>
          <button class="modal-exit" @click="$emit('close')">
            <div class="modal-exit-span"></div>
            <div class="modal-exit-span"></div>
          </button>
        </div>
      </div>
    </div>
    </transition> -->
  </div>
</template>
<script>
  export default {
    data() {
      return {}
    },
  }
</script>
<style lang="scss">
  .modal-mask {
    position: fixed;
    z-index: 19;
    backdrop-filter: blur(2px);
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.507);
    //display: table;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity .3s ease;


  }

  .modal-wrapper {
    // display: table-cell;
    vertical-align: middle;
    z-index: 20;
  }

  .modal-container {
    max-width: 800px;
    margin: 0px auto;
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
    position: relative;
  }

  .modal-header h3 {
    margin-top: 0;
    color: #42b983;
  }

  .modal-body {
    margin: 20px 0;
  }

  .modal-exit {
    position: absolute;
    top: 15px;
    right: 15px;
    border-radius: 70%;
    color: black;
    background-color: rgb(151, 151, 151);
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
    display: flex;
    width: 25px;
    height: 25px;
    border: none;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
  }

  .modal-exit div:nth-child(1) {
    transform: rotate(45deg);
  }

  .modal-exit div:nth-child(2) {
    transform: rotate(-45deg);
  }

  .modal-exit-span {
    position: absolute;
    width: 16px;
    height: 1px;
    background-color: #fff;
  }

  .modal-default-button {
    float: right;
  }

  /* .modal-enter {
    opacity: 0;
  }

  .modal-leave-active {
    opacity: 0;
  }

  .modal-enter .modal-container,
  .modal-leave-active .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }*/
</style>