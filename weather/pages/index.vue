<template>
  <div>
    <div class="wrapper_index">

      <section class="hero is-white is-medium">
        <div class="hero-body">
          <div class="container">
            <h1 class="title has-text-centered">
              Расчет температуры рельсов
            </h1>
            <h2 class="subtitle has-text-centered">
              Добро пожаловать на сайт!
            </h2>
            <div class="subtitle has-text-centered">
              <nuxt-link class="button is-warning" to="weather">Прогноз</nuxt-link>
            </div>
          </div>
        </div>
      </section>

      <div class="container">
        <div class="c-card-wrapper">

          <div class="c-card">
            <div class="c-card-content">
              <div class="c-card-title title">Прогноз</div>
              <div class="c-card-text subtitle"> Просмотреть текщие погодныне условия и прогноз на 5 ближайшие дней
              </div>
            </div>
            <div class="c-card-footer">
              <nuxt-link class="button is-medium is-fullwidth is-dark" to="weather">Подробнее</nuxt-link>
            </div>
          </div>

          <div class="c-card">
            <div class="c-card-content">
              <div class="c-card-title title">Обслуживание</div>
              <div class="c-card-text subtitle">Рекомендации по возможности обслуживания путей</div>
            </div>
            <div class="c-card-footer">
              <nuxt-link class="button is-medium is-fullwidth is-dark" to="recommendations">Подробнее</nuxt-link>
            </div>
          </div>

          <div class="c-card">
            <div class="c-card-content">
              <div class="c-card-title title">Нормативная документация</div>
              <div class="c-card-text subtitle"> Просмотреть текщие погодныне условия и прогноз на 5 ближайшие дней
              </div>
            </div>
            <div class="c-card-footer">
              <nuxt-link class="button is-medium is-fullwidth is-dark" to="documentation">Подробнее</nuxt-link>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    components: {

    },

    data() {
      return {}
    },
  }
</script>

<style>
  .wrapper_index {
    padding: 64px 0;

  }

  .is-custom-back {
    background: url(/cust-back.svg) no-repeat;
    background-size: 100% 100%;
    width: 100%;
    height: 100%;
  }

  .card-footer {
    padding: 15px;
    padding-left: 24px;
  }


  /* ---------- */
  .background-logo {
    background: url(/background-logo.svg) -10% 120px no-repeat;

    /*height:100%;
    width:100%;*/
  }

  .header-red-line {
    height: 100px;
    margin-bottom: -100px;
    background: rgb(70, 70, 70);
    /*#756060;*/
  }

  .header-above-title-box {
    height: 100px;
    background: #75606000;
  }

  .c-card-wrapper {

    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    align-items: stretch;
  }

  .c-card {
    min-width: 31%;
    max-width: 31%;
    min-height: 200px;
    background-color: rgb(255, 255, 255);
    box-shadow: 0px 0px 7px 5px rgba(50, 50, 50, 0.068);
    border-radius: 4px;
    margin: 15px 10px;
    padding: 20px;
    transition: .2s;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .c-card-title {
    padding-right: 15px;
  }

  .c-card-text {
    margin-top: -15px !important;
  }

  .c-card-footer {
    margin-top: 24px;
    display: block;
  }


  @media screen and (max-width: 986px) {
    .c-card {
      min-width: 100%;
      margin: 10px 0;
    }
  }

  /* ---------- */
</style>