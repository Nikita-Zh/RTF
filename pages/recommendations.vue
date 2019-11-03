<template>
  <div>
    <div class="container wrapper">
      <div class="level">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Местоположение</p>
            <p class="title">{{City}}</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Рельс</p>
            <p class="title"> {{cityRailTemp + '°C'}}</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Температура</p>
            <p class="title"> {{cityTemp + '°C'}}</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">Выбрать другое</p>
            <p class="title">
              <nuxt-link class="button is-dark" to="/weather">Местоположение</nuxt-link>
            </p>
          </div>
        </div>
      </div>

      <div>
        <modal v-if="showModal" @close="showModal = false">
          <div slot="header" class="modal-card-title">
            <p>Температура закрепления</p>
          </div>
          <div slot="body">
            <input v-model="inputTemp" class="input " type="number" placeholder="Введите температуру закрепления">
          </div>
          <div slot="footer">
            <button :disabled="isDisabled" class="button is-success  is-fullwidth"
              @click="showModal = false, setFixationTemp()">Подтвердить</button>
          </div>
        </modal>
      </div>

      <div class="tile is-ancestor">
        <div class="tile is-vertical is-parent">
          <div class="tile is-child box">
            <p class="title">1. Температура закрепления</p>
            <p class="content">Заданная температура закрепления: <span class="subtitle">{{current_fixationTemp}}</span>
            </p>
            <button @click="showModal = true" class="button is-medium is-fullwidth is-info">Задать температуру
              закрепления</button>
          </div>
        </div>
      </div>

      <div class="level">
        <p class="level-item has-text-centered">Допускаемые изменения температуры рельсовых плетей при:</p>
      </div>

      <div class="tabs is-centered is-boxed">
        <ul>
          <li @click="tabsToggle(), tabsParams={is4_1:true, is4_2:false}" class="is-active"><a>Текущем содержании
              бесстыкового пути</a></li>
          <li @click="tabsToggle(), tabsParams={is4_1:false, is4_2:true}"><a>Работе путевых машин</a></li>
        </ul>
      </div>
      <keep-alive>
        <transition name="comp">
          <putevye-works v-show="tabsParams.is4_1" ref="putevye"></putevye-works>
        </transition>
      </keep-alive>

      <keep-alive>
        <transition name="comp">
          <machine v-show="tabsParams.is4_2" ref="machine"></machine>
        </transition>
      </keep-alive>
    </div>

  </div>
</template>



<script>
  import PutevyeWorks from '@/components/recommendations_components/Putevye.vue'
  import Machine from '@/components/recommendations_components/Machine.vue'


  import Modal from '@/components/Modal.vue'
  export default {
    components: {
      PutevyeWorks,
      Machine,
      Modal,

    },
    data() {
      return {
        tabsParams: {
          is4_1: true,
          is4_2: false
        },
        showModal: false,
        inputTemp: '',
        current_fixationTemp: '',
        Results: true,
        City: '',
        cityTemp: '',
        cityRailTemp: '',
      }
    },
    computed: {
      isDisabled() {
        if (this.inputTemp != '') {
          return false
        } else return true
      },
    },
    mounted: function () {

      this.City = JSON.parse(localStorage.getItem('current_weather')).city.name
      this.cityTemp = JSON.parse(localStorage.getItem('current_weather')).main.temp
      this.cityRailTemp = JSON.parse(localStorage.getItem('current_weather')).main.rail

      const tabs = document.querySelectorAll("div.tabs ul li")
      tabs.forEach(el => {
        el.addEventListener('click', () => {
          el.classList.add('is-active')
        })
      });
      if (localStorage.getItem('fixation_temp') !== null) {
        this.current_fixationTemp = localStorage.getItem('fixation_temp')
      } else {
        localStorage.setItem('fixation_temp', 0)
        this.current_fixationTemp = '0'
      }
    },
    methods: {
      tabsToggle() {
        document.querySelectorAll("div.tabs ul li.is-active")[0].classList.remove('is-active')
      },
      setFixationTemp() {
        this.current_fixationTemp = this.inputTemp
        localStorage.setItem('fixation_temp', this.inputTemp)
        this.$refs.putevye.isSuccessMethod()
        this.$refs.machine.isSuccessMethod()
      }
    }
  }
</script>

<style>
  .hero-minus-margin {
    margin-top: calc(20px);
    border-radius: 4px;
  }

  .success {
    border: solid 2px rgb(0, 255, 0);
  }

  .danger {
    border: solid 2px rgb(255, 0, 0);
  }
</style>