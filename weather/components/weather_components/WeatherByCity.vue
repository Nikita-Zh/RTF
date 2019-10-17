<template>
  <div class="tile is-ancestor">
    <div class="tile is-vertical is-parent">
      <div class="tile is-child box">
        <p class="title">1. Выбрать страну</p>
        <div class="field">
          <div class="control has-icons-left">
            <div class="select">
              <select name="sel_name" id="selected">
                <option disabled selected value="!+">Выбрать</option>
                <option value="RU">Россия</option>
                <option value="UA">Украина</option>
                <option value="BY">Белоруссия</option>
              </select>
            </div>
            <div class="icon is-small is-left">
              <i class="fas fa-globe" style="display:flex;align-item:center;"><img src="planet-earth.svg"
                  width='22px'></i>
            </div>
            <a id="sel_counry" class="button is-primary" v-on:click="getCityList">Ok</a>
          </div>

        </div>

      </div>
      <div class="tile is-child box">
        <p class="title">2. Выбрать город</p>
        <div class="city-main">
          <input class="input" id="filter" type="text" placeholder="Поиск" v-on:input="FilterInput()">
          <div class=" city-list" id="sel_city">
            <div class="unsel-item">Выбрать город</div>
            <div class="city-items" v-for="city in cities" :key="city.id" v-on:click="getWeather(city.id)">
              {{city.name}}
            </div>
          </div>
        </div>
      </div>
      <!--    <forecast ref="forecast"></forecast> -->
    </div>
  </div>
</template>

<script>
  import Forecast from '@/components/weather_components/Forecast.vue'
  import axios from 'axios'
  import test from '@/assets/scripts/test.js'

  const appKey = "315c9f5b55e01a3815512c1958910fb7"

  export default {
    components: {
      Forecast,
    },
    data() {
      return {
        cityData: null,
        cities: [],
        cityWeather: [],
        city: null,
        temp: null,
        clouds: null,
        rail: null,
      }
    },

    computed: {
      classObject: function () {
        return {

        }
      }
    },

    mounted: function () {

    },

    methods: {
      getForecast() {
        this.$parent.getForecast()
      },
      /*получение списка городов по выбранной стране*/
      getCityList() {
        if (localStorage.getItem('city-list') !== null) {
          sel_counry.classList.add('is-loading')
          this.cities = []
          this.cityData = JSON.parse(localStorage.getItem('city-list'))
          for (let key in this.cityData) {
            if (this.cityData[key].country == selected.value) {
              this.cities.push(this.cityData[key])
            }
          }
          sel_counry.classList.remove('is-loading')
        } else {
          sel_counry.classList.add('is-loading')
          axios.get(`/sortedList.json`)
            .then(response => {
              this.cities = []
              this.cityData = response.data
              localStorage.setItem('city-list', JSON.stringify(response.data))
              for (let key in this.cityData) {
                if (this.cityData[key].country == selected.value) {
                  this.cities.push(this.cityData[key])
                }
              }
              sel_counry.classList.remove('is-loading')
            })
        }
      },
      getWeather(id) {
        axios.get(`https://api.openweathermap.org/data/2.5/weather?id=` + id + "&appid=" + appKey)
          .then(response => {
            console.log('response data: ', response.data)
            let myObject = new Object
            myObject.dt = response.data.dt
            myObject.timezone = response.data.timezone
            myObject.city = {
              name: response.data.name,
              lat: response.data.coord.lat,
              lon: response.data.coord.lon,
              id: response.data.id
            }
            myObject.main = {
              temp: Math.round(response.data.main.temp - 273),
              clouds: response.data.clouds.all,
              wind: response.data.wind.speed,
              humidity: response.data.main.humidity,
            }
            this.showWeaterbyData(myObject)
          })
      },

      showWeaterbyData(data) {
        console.log(data)
        let coeff = () => {
          let curr_lat = parseFloat(data.city.lat)

          //console.log(curr_lat)
          let GeoLat = [0, 10, 20, 30, 40, 50, 60, 70, 75, 80, 85]
          let ArrCoeffA = [0.38, 0.40, 0.37, 0.36, 0.38, 0.40, 0.36, 0.18, 0.16, 0.15, 0.14]
          let i = 0;
          let item = 0;
          let index = 0;
          //console.log(GeoLat[i])
          while (curr_lat > GeoLat[i]) {
            //console.log(GeoLat[i])
            item = GeoLat[i]
            index = i
            i++
          }
          let razGeo = GeoLat[index + 1] - item //разность соседних пунктов широты
          let razCurrLat = curr_lat - item // разность текущей широты и меньшего пункта
          let ratioGeo = razCurrLat /
            razGeo // отношение разности пунктов к разности текущей широты и меньшего пункта
          let razCoeff = ArrCoeffA[index + 1] - ArrCoeffA[index] // разность правого коэффициента к левому 
          let coeffA = ArrCoeffA[index] + (razCoeff * ratioGeo) // точный коэффициент для текущей широты
          localStorage.setItem('current_coeffA', coeffA)
          //console.log(coeffA)
          let coeffN = parseFloat(data.main.clouds) / 100
          // console.log(coeffN)
          let coeffK = 1 - (coeffA + 0.38 * coeffN) * coeffN
          //console.log(coeffK)
          localStorage.setItem('current_coeffK', coeffK)
        };

        /*---------------------------- rail--------------------------------- */

        let railTemp = () => {
          let K = parseFloat(localStorage.getItem('current_coeffK'))
          let dayDate = parseInt(localStorage.getItem('current_numberOfTheDay'))
          let lat = parseFloat(data.city.lat)
          let CoefAtm = parseFloat(localStorage.getItem('CoefAtm'))
          let CoefAtmFact = (0.1361 * Math.sin(2 * Math.PI * (dayDate - 94.73) / 365) + 0.2158) * (1.8342 - 0.0152 * lat)
          console.log('CoefAtmFact',CoefAtmFact)
          let Io = parseInt(localStorage.getItem('Io'))
          let Br = parseInt(localStorage.getItem('Br'))
          let Hr = parseInt(localStorage.getItem('Hr'))


          let SMax365 = () => {

            let tauDate = (hour) => {
              let difference = 12 - hour
              let degree = difference * 15
              //console.log(degree)
              return (degree)
            };

            let sinHDate = (dayDate, hh) => {
              let delta = 23.45 * Math.sin((360 * (284 + dayDate) / 365) * Math.PI / 180);
              let k1 = 1.7
              let k2 = 1.7
              if (hh == 12) {
                k1 = 2
              }

              let tau = tauDate(hh)

              let sinH = Math.sin(lat * Math.PI / 180) *
                Math.sin(delta * Math.PI / 180) +
                Math.cos(lat * Math.PI / 180) *
                Math.cos(delta * Math.PI / 180) *
                Math.cos(tau * Math.PI / 180);


              if (sinH < 0) {
                sinH = 0
              }

              let sunHight = Math.asin(sinH) * 180 / Math.PI //высота солнца

              let Sort = Io * sinH / (sinH + CoefAtm)

              let Sgor = Sort * sinH

              let cosQ0 = Math.cos(sunHight * Math.PI / 180) * Math.abs(Math.sin((180 - tau) * Math.PI /
                180))

              let cosQ90 = Math.cos(sunHight * Math.PI / 180) * Math.abs(Math.sin((180 - tau - 90) * Math
                .PI / 180))

              let S0ver = Sort * cosQ0

              let S90ver = Sort * cosQ90

              let S0 = k1 * (Sgor * Br + S0ver * Hr) / 2000

              let S90 = k2 * (Sgor * Br + S90ver * Hr) / 2000

              let S = 0.5 * (S0 + S90)
              return S90
            }

            let MAX_S90 = 0
            let CUR_S90 = 0
            for (let i = 1; i <= 365; i++) {
              let dayDate = i
              let hh = 12
              CUR_S90 = sinHDate(dayDate, hh)
              MAX_S90 = Math.max(CUR_S90, MAX_S90)
            }
            console.log("MAX_S90", MAX_S90)
            localStorage.setItem('max_s90_365', MAX_S90)
            return MAX_S90
          }


          let Smax = SMax365()


          let tauDate = (hour) => {
            let difference = 12 - hour
            let degree = difference * 15
            //console.log('degree', degree)
            return (degree)
          };

          let sinHDate = (hh) => {
            let delta = 23.45 * Math.sin((360 * (284 + dayDate) / 365) * Math.PI / 180);
            //console.log('delta', delta)
            let k1 = 1.7
            let k2 = 1.7
            if (hh == 12) {
              k1 = 2
            }

            let tau = tauDate(hh)

            let sinH = Math.sin(lat * Math.PI / 180) *
              Math.sin(delta * Math.PI / 180) +
              Math.cos(lat * Math.PI / 180) *
              Math.cos(delta * Math.PI / 180) *
              Math.cos(tau * Math.PI / 180);
            // console.log('sinH', sinH)
            if (sinH < 0) {
              sinH = 0
            }
            let sunHight = Math.asin(sinH) * 180 / Math.PI //высота солнца
            //console.log('sunHight', sunHight)

            let Sort = Io * sinH / (sinH + CoefAtmFact)
            //console.log('Sort', Sort)

            let Sgor = Sort * sinH
            //console.log('Sgor', Sgor)

            let cosQ0 = Math.cos(sunHight * Math.PI / 180) * Math.abs(Math.sin((180 - tau) * Math.PI / 180))
            //console.log('cosQ0 ', cosQ0)

            let cosQ90 = Math.cos(sunHight * Math.PI / 180) * Math.abs(Math.sin((180 - tau - 90) * Math.PI /
              180))
            //console.log('cosQ90 ', cosQ90)

            let S0ver = Sort * cosQ0
            //console.log('S0ver ', S0ver)

            let S90ver = Sort * cosQ90
            //console.log('S90ver ', S90ver)

            let S0 = k1 * (Sgor * Br + S0ver * Hr) / 2000
            //console.log('S0 ', S0)

            let S90 = k2 * (Sgor * Br + S90ver * Hr) / 2000
            //console.log('S90 ', S90)

            let S = 0.5 * (S0 + S90)
            //console.log('S ', S)
            //console.log("")
            let deltaT90 = (S90 * 25) / Smax * K
            let deltaT0 = (S0 * 25) / Smax * K
            let deltaT = 0.5 * (deltaT0 + deltaT90)


            return {
              'sunHight': sunHight,
              'Sort': Sort,
              'Sgor': Sgor,
              'cosQ0': cosQ0,
              'cosQ90': cosQ90,
              'S0ver': S0ver,
              'S90ver': S90ver,
              'S0': S0,
              'S90': S90,
              'S': S,
              'deltaT0': deltaT0,
              'deltaT90': deltaT90,
              'deltaT': deltaT
            }
          }

          let date = new Date(data.dt * 1000)
          let timezone = data.timezone / 3600

          let hh = date.getHours() + (date.getTimezoneOffset() / 60) + timezone

          console.log('hh', hh)
          let coefficients = sinHDate(hh)

          console.log(coefficients)
          return coefficients.deltaT
        }

        /*------------------------------------- end rail -----------------------------------------*/
        coeff()

        data.main.rail = (railTemp() + Math.round(data.main.temp)).toFixed(1)
        localStorage.setItem('current_weather', JSON.stringify(data))
        this.$emit('changeCityParams', {
          city: data.city.name,
          temp: data.main.temp,
          clouds: data.main.clouds,
          rail: parseFloat(JSON.parse(localStorage.getItem('current_weather')).main.rail)
        })
        this.$parent.getForecast()
        //this.$refs.forecast.weatherForecast_5day3hour()
      },

      /*погода в выбранном городе*/
      showWeater(id) {
        axios.get(`https://api.openweathermap.org/data/2.5/weather?id=` + id + "&appid=" + appKey)
          .then(response => {
            this.cityWeather = []
            //console.log(response.data)
            this.cityWeather.push("Местоположение: " + response.data.name)
            this.cityWeather.push("Температура: " + Math.round(response.data.main.temp - 273) + "c")
            this.cityWeather.push("Облачность: " + response.data.clouds.all + "%")
            this.cityWeather.push("Скорость ветра: " + response.data.wind.speed + "m/s")
            this.cityWeather.push("Влажность: " + response.data.main.humidity + "%")
            //console.log(this.cityWeather)

            let coeff = () => {
              let curr_lat = parseFloat(response.data.coord.lat)
              //console.log(curr_lat)
              let GeoLat = [0, 10, 20, 30, 40, 50, 60, 70, 75, 80, 85]
              let ArrCoeffA = [0.38, 0.40, 0.37, 0.36, 0.38, 0.40, 0.36, 0.18, 0.16, 0.15, 0.14]
              let i = 0;
              let item = 0;
              let index = 0;
              //console.log(GeoLat[i])
              while (curr_lat > GeoLat[i]) {
                //console.log(GeoLat[i])
                item = GeoLat[i]
                index = i
                i++
              }
              let razGeo = GeoLat[index + 1] - item //разность соседних пунктов широты
              let razCurrLat = curr_lat - item // разность текущей широты и меньшего пункта
              let ratioGeo = razCurrLat /
                razGeo // отношение разности пунктов к разности текущей широты и меньшего пункта
              let razCoeff = ArrCoeffA[index + 1] - ArrCoeffA[index] // разность правого коэффициента к левому 
              let coeffA = ArrCoeffA[index] + (razCoeff * ratioGeo) // точный коэффициент для текущей широты
              //console.log(coeffA)
              let coeffN = parseFloat(response.data.clouds.all) / 100
              // console.log(coeffN)
              let coeffK = 1 - (coeffA + 0.38 * coeffN) * coeffN
              //console.log(coeffK)
              localStorage.setItem('current_coeffK', coeffK)
            };

            /*---------------------------- rail--------------------------------- */

            let railTemp = () => {
              let K = parseFloat(localStorage.getItem('current_coeffK'))
              let dayDate = parseInt(localStorage.getItem('current_numberOfTheDay'))
              let lat = parseFloat(response.data.coord.lat)
              let CoefAtm = parseFloat(localStorage.getItem('CoefAtm'))
              let Io = parseInt(localStorage.getItem('Io'))
              let Br = parseInt(localStorage.getItem('Br'))
              let Hr = parseInt(localStorage.getItem('Hr'))


              let SMax365 = () => {

                let tauDate = (hour) => {
                  let difference = 12 - hour
                  let degree = difference * 15
                  //console.log(degree)
                  return (degree)
                };

                let sinHDate = (dayDate, hh) => {
                  let delta = 23.45 * Math.sin((360 * (284 + dayDate) / 365) * Math.PI / 180);
                  let k1 = 1.7
                  let k2 = 1.7
                  if (hh == 12) {
                    k1 = 2
                  }

                  let tau = tauDate(hh)

                  let sinH = Math.sin(lat * Math.PI / 180) *
                    Math.sin(delta * Math.PI / 180) +
                    Math.cos(lat * Math.PI / 180) *
                    Math.cos(delta * Math.PI / 180) *
                    Math.cos(tau * Math.PI / 180);


                  if (sinH < 0) {
                    sinH = 0
                  }

                  let sunHight = Math.asin(sinH) * 180 / Math.PI //высота солнца

                  let Sort = Io * sinH / (sinH + CoefAtm)

                  let Sgor = Sort * sinH

                  let cosQ0 = Math.cos(sunHight * Math.PI / 180) * Math.abs(Math.sin((180 - tau) * Math.PI /
                    180))

                  let cosQ90 = Math.cos(sunHight * Math.PI / 180) * Math.abs(Math.sin((180 - tau - 90) * Math
                    .PI / 180))

                  let S0ver = Sort * cosQ0

                  let S90ver = Sort * cosQ90

                  let S0 = k1 * (Sgor * Br + S0ver * Hr) / 2000

                  let S90 = k2 * (Sgor * Br + S90ver * Hr) / 2000

                  let S = 0.5 * (S0 + S90)
                  return S90
                }

                let MAX_S90 = 0
                let CUR_S90 = 0
                for (let i = 1; i <= 365; i++) {
                  let dayDate = i
                  let hh = 12
                  CUR_S90 = sinHDate(dayDate, hh)
                  MAX_S90 = Math.max(CUR_S90, MAX_S90)
                }
                // console.log(MAX_S90)
                localStorage.setItem('max_s90_365', MAX_S90)
                return MAX_S90
              }


              let Smax = SMax365()


              let tauDate = (hour) => {
                let difference = 12 - hour
                let degree = difference * 15
                //console.log('degree', degree)
                return (degree)
              };

              let sinHDate = (hh) => {
                let delta = 23.45 * Math.sin((360 * (284 + dayDate) / 365) * Math.PI / 180);
                //console.log('delta', delta)
                let k1 = 1.7
                let k2 = 1.7
                if (hh == 12) {
                  k1 = 2
                }

                let tau = tauDate(hh)

                let sinH = Math.sin(lat * Math.PI / 180) *
                  Math.sin(delta * Math.PI / 180) +
                  Math.cos(lat * Math.PI / 180) *
                  Math.cos(delta * Math.PI / 180) *
                  Math.cos(tau * Math.PI / 180);
                // console.log('sinH', sinH)
                if (sinH < 0) {
                  sinH = 0
                }
                let sunHight = Math.asin(sinH) * 180 / Math.PI //высота солнца
                //console.log('sunHight', sunHight)

                let Sort = Io * sinH / (sinH + CoefAtm)
                //console.log('Sort', Sort)

                let Sgor = Sort * sinH
                //console.log('Sgor', Sgor)

                let cosQ0 = Math.cos(sunHight * Math.PI / 180) * Math.abs(Math.sin((180 - tau) * Math.PI / 180))
                //console.log('cosQ0 ', cosQ0)

                let cosQ90 = Math.cos(sunHight * Math.PI / 180) * Math.abs(Math.sin((180 - tau - 90) * Math.PI /
                  180))
                //console.log('cosQ90 ', cosQ90)

                let S0ver = Sort * cosQ0
                //console.log('S0ver ', S0ver)

                let S90ver = Sort * cosQ90
                //console.log('S90ver ', S90ver)

                let S0 = k1 * (Sgor * Br + S0ver * Hr) / 2000
                //console.log('S0 ', S0)

                let S90 = k2 * (Sgor * Br + S90ver * Hr) / 2000
                //console.log('S90 ', S90)

                let S = 0.5 * (S0 + S90)
                //console.log('S ', S)
                //console.log("")
                let deltaT90 = (S90 * 25) / Smax * K
                let deltaT0 = (S0 * 25) / Smax * K
                let deltaT = 0.5 * (deltaT0 + deltaT90)


                return {
                  'sunHight': sunHight,
                  'Sort': Sort,
                  'Sgor': Sgor,
                  'cosQ0': cosQ0,
                  'cosQ90': cosQ90,
                  'S0ver': S0ver,
                  'S90ver': S90ver,
                  'S0': S0,
                  'S90': S90,
                  'S': S,
                  'deltaT0': deltaT0,
                  'deltaT90': deltaT90,
                  'deltaT': deltaT
                }
              }

              let date = new Date(response.data.dt * 1000)
              let timezone = response.data.timezone / 3600
              let hh = date.getHours() + (date.getTimezoneOffset() / 60) + timezone

              // console.log('hh', hh)
              let coefficients = sinHDate(hh)

              //console.log(coefficients)
              return coefficients.deltaT
            }

            /*------------------------------------- end rail -----------------------------------------*/
            coeff()


            let myObject = new Object
            myObject.city = {
              name: response.data.name,
              lat: response.data.coord.lat,
              lon: response.data.coord.lon,
              id: response.data.id
            }
            myObject.main = {
              temp: Math.round(response.data.main.temp - 273),
              clouds: response.data.clouds.all,
              wind: response.data.wind.speed,
              humidity: response.data.main.humidity,
              rail: (railTemp() + Math.round(response.data.main.temp - 273)).toFixed(1)
            }
            localStorage.setItem('current_weather', JSON.stringify(myObject))
            this.$emit('changeCityParams', {
              city: response.data.name,
              temp: Math.round(response.data.main.temp - 273),
              clouds: response.data.clouds.all,
              rail: parseFloat(JSON.parse(localStorage.getItem('current_weather')).main.rail)
            })
            this.city = response.data.name
            this.temp = Math.round(response.data.main.temp - 273)
            this.clouds = response.data.clouds.all
            this.rail = 1111
            //console.log(localStorage.getItem('current_lat'), localStorage.getItem('current_lon'))
            this.$parent.getForecast()
            //this.$refs.forecast.weatherForecast_5day3hour()
          })

      },

      /*поиск в списке городов*/
      FilterInput() {
        let x = filter.value.toLowerCase()
        let Divs = document.querySelectorAll("div.city-items")
        Divs.forEach(el => {
          let elText = el.innerHTML.toLowerCase()
          if (elText.includes(x)) {
            el.classList.remove("hidden")
          } else el.classList.add("hidden")
        })
      },
    }
  }
</script>
<style>
  .tile {
    transition: .5s;
  }


  .weather-container {
    display: flex;
    height: calc(100vh - 70px);
    padding: 10px 5vw;
    justify-content: center;
    align-items: center;
  }

  .weather-main {
    width: auto;
  }

  .city-list {
    max-height: 40vh;
    overflow: auto;
    padding: 5px 0;
    margin: 20px 0 0 0;
    box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.1);
    border: solid 1px;
    border-radius: 4px;
    border-color: #dbdbdb;
    color: #363636;
    transition: .2s;
  }

  .city-items {
    display: block;
    cursor: pointer;
    background-color: #b1b1b100;
    padding: 3px 15px;
    /*border-radius: 4px; */
    /*transition: .1s;*/
  }

  .city-items:hover {
    background-color: rgb(224, 224, 224);
  }

  .city-items:focus {
    background-color: rgb(202, 0, 0);
  }


  .unsel-item {
    color: #bbbbbb;
    padding: 3px 15px;
    font-weight: 100;
  }

  .hidden {
    display: none;
  }
</style>