<template>
  <div>
    <section>
      <nav class="navbar is-fixed-top" role="navigation" aria-label="main navigation">
        <div class="container">
          <div class="navbar-brand">
            <nuxt-link class="navbar-item" to="/">
              <img src="logo.svg" width="203" height="28">
            </nuxt-link>

            <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false"
              data-target="navbarBasicExample">
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
          </div>

          <div id="navbarBasicExample" class="navbar-menu">
            <div class="navbar-start">

            </div>

            <div class="navbar-end">
              <nuxt-link class="navbar-item" to="/"> Главная</nuxt-link>
              <nuxt-link class="navbar-item" to="/weather"> Погода</nuxt-link>
              <nuxt-link class="navbar-item" to="/weather_test"> Тест</nuxt-link>
              <nuxt-link class="navbar-item" to="/computed"> Computed</nuxt-link>
              <nuxt-link class="navbar-item" to="/recommendations">Обслуживание пути</nuxt-link>
            </div>
          </div>
        </div>
      </nav>

    </section>
  </div>

</template>


<script>
  export default {
    data() {
      return {}
    },

    mounted: function () {
      const $navbarBurgers = document.querySelectorAll('.navbar-burger')
      const $navbarItems = document.querySelectorAll('.navbar-item')
      if ($navbarBurgers.length > 0) {
        $navbarBurgers.forEach(el => {
          el.addEventListener('click', () => {

            const target = el.dataset.target;
            const $target = document.getElementById(target);

            el.classList.toggle('is-active');
            $target.classList.toggle('is-active');

          });
        });
      }
    },
  }

</script>

<style>
  .navbar {
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
    z-index: 21;
  }


</style>
