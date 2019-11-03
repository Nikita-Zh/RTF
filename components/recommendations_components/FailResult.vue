<template>
  <section class="hero  is-danger is-bold hero-minus-margin">
    <div class="hero-body">
      <div class="container">
        <h1 class="title">
          Работу требуется отложить!
        </h1>
        <h2 class="subtitle">

        </h2>
        <div class="content">
          <slot name="body">
          </slot>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
  export default {
    data() {
      return {}
    },
    mounted: function () {

    }
  }

</script>
