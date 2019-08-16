<template>
  <div>
    <div class="container wrapper">
      <h1 class="red">Hello!</h1>
    </div>
  </div>
</template>

<script>
  import NavBar from '@/components/NavBar.vue'

  export default {
    components: {
      NavBar
    },

    data() {
      return {
      }
    },
  }

</script>

<style>

  .red {
    color: red;
  }


</style>
