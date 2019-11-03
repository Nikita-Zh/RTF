<template>
  <div>
    <div class="container wrapper">

      <!-- level -->
      <div class="level">
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">местоположение</p>
            <p class="title">{{cityParams.city}}</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">рельс</p>
            <p class="title">{{cityParams.rail + '°C'}}</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">облачность</p>
            <p class="title">{{cityParams.clouds + '%'}}</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">температура</p>
            <p class="title">{{cityParams.temp + '°C'}}</p>
          </div>
        </div>
        <div class="level-item has-text-centered">
          <div>
            <p class="heading">данные</p>
            <p class="title"><button class="button is-dark" @click="showModal = true">Корректировать данные</button></p>
          </div>
        </div>
      </div>

      <!-- tabs -->
      <div class="tabs is-centered is-boxed">
        <ul>
          <li @click="tabsToggle(), tabsParams={isCity:true, isGeo:false}" class="is-active"><a>По
              городу</a></li>
          <li @click="tabsToggle(), tabsParams={isCity:false, isGeo:true}"><a>По координатам</a></li>
        </ul>
      </div>



      <!-- WeatherByCity -->

      <keep-alive>
        <weather-by-city v-show="tabsParams.isCity" @changeCityParams='cityParams = $event' ref="byCity">
        </weather-by-city>
      </keep-alive>

      <!-- WeatherByGeo -->
      <keep-alive>
        <weather-by-geo v-show="tabsParams.isGeo" @changeCityParams='cityParams = $event' ref="byGeo"></weather-by-geo>
      </keep-alive>

      <forecast title="rerer" :props_table_tr="propsdata" ref="ref_forecast"></forecast>

    </div>
    <modal v-if="showModal" @close="showModal = false">
      <div slot="header" class="modal-card-title">
        <p>Корректировка:</p>
      </div>
        <div slot="body">
        <label>Температура:</label>
        <input v-model="inputTemp" class="input " type="number" placeholder="Введите температуру">
        <label>Облачность:</label>
        <input v-model="inputClouds" class="input " type="number" min="0" max="100"
          placeholder="Введите значение от 0 до 100, %">
        <label>Ветер:</label>
        <input v-model="inputWind" class="input " type="number" placeholder="Введите скорость ветра">
      </div>
      <div slot="footer">
        <button class="button is-success is-fullwidth" @click="showModal = false, setChanges()">Подтвердить</button>
      </div>
    </modal>
  </div>
</template>

<script>
  import WeatherByCity from '@/components/weather_components/WeatherByCity.vue'
  import WeatherByGeo from '@/components/weather_components/WeatherByGeo.vue'
  import Forecast from '@/components/weather_components/Forecast.vue'
  import Modal from '@/components/Modal.vue'
  import axios from 'axios'
  import {
    timeout
  } from 'q';

  const appKey = "315c9f5b55e01a3815512c1958910fb7"

  export default {
    components: {
      WeatherByCity,
      WeatherByGeo,
      Forecast,
      Modal,
    },

    data() {
      return {
        cityParams: {
          city: '0',
          temp: 0,
          clouds: 0,
          rail: 0,
        },
        tabsParams: {
          isCity: true,
          isGeo: false,
        },
        cityData: null,
        cities: [],
        cityWeather: [],
        isActive: true,
        showModal: false,
        inputTemp: '',
        inputClouds: '',
        inputWind: '',
        propsdata: [{
          'main': {
            'temp': 1,
            'rail': 2,
            'clouds': 3,
            'wind': 4
          },
          date_txt: 123
        }]
      }
    },

    computed: {
      /*isNotUpdated() {
        if (localStorage.getItem('data_5/3') !== null) {
          let curr_city = (JSON.parse(localStorage.getItem('current_weather'))).city.id
          let forecast_city = (JSON.parse(localStorage.getItem('data_5/3'))).city.id
          if (curr_city == forecast_city) {
            console.log('true!')
            return true
          } else {
            console.log('wrong')
            return false
          }
        } else {
            console.log('wrong')
            return false
        }
      }*/
    },


    mounted: function () {
      this.tabsfunction()
      this.getNumberOfTheDay()
      if (localStorage.getItem('current_weather') !== null) {

        let current_weather = JSON.parse(localStorage.getItem('current_weather'))
        try {
          this.cityParams.city = current_weather.city.name
          this.cityParams.temp = current_weather.main.temp
          this.cityParams.clouds = current_weather.main.clouds
          this.cityParams.rail = current_weather.main.rail
        } catch {}
      } else {

      }

    },

    methods: {
      tabsfunction() {
        const tabs = document.querySelectorAll("div.tabs ul li")
        tabs.forEach(el => {
          el.addEventListener('click', () => {
            el.classList.add('is-active')
          })
        });
      },
      getNumberOfTheDay() {
        let now = new Date()
        var dd = now.getDate()
        var mm = now.getMonth() + 1
        var yy = now.getFullYear() % 100
        let Monthes = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        let N = 0
        let i = 0
        while (i != mm - 1) {
          N += Monthes[i]
          i++
        }
        if (((yy % 4 == 0 && yy % 100 != 0) || yy % 400 == 0) && mm > 2) N++;
        localStorage.setItem('current_numberOfTheDay', N + dd)
      },
      getForecast() {
        // alert(123)
        this.$refs.ref_forecast.weatherForecast_5day3hour()
      },
      tabsToggle() {
        document.querySelectorAll("div.tabs ul li.is-active")[0].classList.remove('is-active')
      },
      setChanges() {
        if (localStorage.getItem('current_weather') !== null) {
          let data = JSON.parse(localStorage.getItem('current_weather'))
          if (this.inputTemp != '') data.main.temp = this.inputTemp;
          if (this.inputClouds != '') {
            if (parseInt(this.inputClouds) > 100) {
              data.main.clouds = 100
            } else if (parseInt(this.inputClouds) < 0) {
              data.main.clouds = 0
            } else {
              data.main.clouds = this.inputClouds
            };
          }
          if (this.inputWind != '') data.main.wind = this.inputWind;
          localStorage.setItem('current_weather', JSON.stringify(data))
          this.$refs.byCity.showWeaterbyData(data)
        }

      },
    }
  }

</script>

<style>

</style>
