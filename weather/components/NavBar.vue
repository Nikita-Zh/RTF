<template>
  <div>
    <section>
      <nav class="navbar is-fixed-top" role="navigation" aria-label="main navigation">
        <div class="container">
          <div class="navbar-brand">
            <nuxt-link class="navbar-item" to="/">
              <img src="logo.svg" width="203" height="28">
            </nuxt-link>

            <a id="navBurger" role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false"
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
              <div class="navbar-item yo" v-on:click="remove_active"><nuxt-link  class="navbar-item nuxt-link" to="/"> Главная</nuxt-link></div>
              <div class="navbar-item yo" v-on:click="remove_active"><nuxt-link  class="navbar-item nuxt-link" to="/weather"> Погода</nuxt-link></div>
              <div class="navbar-item yo" v-on:click="remove_active"><nuxt-link  class="navbar-item nuxt-link" to="/weather_test"> Тест</nuxt-link></div>
              <div class="navbar-item yo" v-on:click="remove_active"><nuxt-link  class="navbar-item nuxt-link" to="/computed"> Computed</nuxt-link></div>
              <div class="navbar-item yo" v-on:click="remove_active"><nuxt-link  class="navbar-item nuxt-link" to="/recommendations">Обслуживание пути</nuxt-link></div>
            </div>
            <!--  <div class="navbar-end">
              <nuxt-link role="button" v-on:click="remove_active" class="navbar-item" to="/"> Главная</nuxt-link>
              <nuxt-link role="button" v-on:click="remove_active" class="navbar-item" to="/weather"> Погода</nuxt-link>
              <nuxt-link role="button" v-on:click="remove_active" class="navbar-item" to="/weather_test"> Тест</nuxt-link>
              <nuxt-link role="button" v-on:click="remove_active" class="navbar-item" to="/computed"> Computed</nuxt-link>
              <nuxt-link role="button" v-on:click="remove_active" class="navbar-item" to="/recommendations">Обслуживание пути</nuxt-link>
            </div>-->
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
    methods: {
      remove_active() {
        let navMenu = document.getElementById('navbarBasicExample')
        let navbarBurgers = document.getElementById('navBurger')
        navbarBurgers.classList.remove('is-active')
        navMenu.classList.remove('is-active')
        console.log('removed!')
      }
    }
  }

</script>

<style>
  .navbar {
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
    z-index: 21;
  }
  .navbar-item{
    transition: .3s;
  }
  .nuxt-link{
    height: 100%;
    width: 100%;
  }
  .yo{
    padding: 0;
  }

</style>
