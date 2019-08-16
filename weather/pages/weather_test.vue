<template>
  <div class="container">
    <div class="weather-container">
      <div class="weather-main">
        <select name="sel_name" id="selected">
          <option disabled selected value="!+">Выбрать</option>
          <option value="RU">Россия</option>
          <option value="UA">Украина</option>
          <option value="BY">Белоруссия</option>
        </select>
        <button id="bt_1" v-on:click="getCityList">Create</button>
        <input id="filter" type="text" placeholder="Поиск" v-on:input="FilterInput()">
        <input id="lat_" type="text" placeholder="Широта">
        <input id="lon_" type="text" placeholder="Долгота">
        <button v-on:click="showWeaterByGeoCoordinates">Geo</button>
        <button v-on:click="weatherForecast_5day3hour">Прогноз</button>

        <div class="city-list">
          <a class="city-items" v-for="city in cities" :key="city.id" v-on:click="showWeater(city.id)">
            {{city.name}}
          </a>
        </div>
      </div>
      <div class="weather-current">
        <div class="weather-box">
          <a class="weather-items" v-for="param in cityWeather" :key="param.id">
            {{param}}
          </a>
        </div>
      </div>

      <!-- Table -->

      <!--<table class="table">
        <thead>
          <tr>
            <th><abbr title="Position">Pos</abbr></th>
            <th>Date</th>
            <th><abbr title="Played">Pld</abbr></th>
            <th><abbr title="Won">W</abbr></th>
            <th><abbr title="Drawn">D</abbr></th>
            <th><abbr title="Lost">L</abbr></th>
            <th><abbr title="Goals for">GF</abbr></th>
            <th><abbr title="Goals against">GA</abbr></th>
            <th><abbr title="Goal difference">GD</abbr></th>
            <th><abbr title="Points">Pts</abbr></th>
            <th>Qualification or relegation</th>
          </tr>
        </thead>
        <tfoot>
          <tr>
            <th><abbr title="Position">Pos</abbr></th>
            <th>Team</th>
            <th><abbr title="Played">Pld</abbr></th>
            <th><abbr title="Won">W</abbr></th>
            <th><abbr title="Drawn">D</abbr></th>
            <th><abbr title="Lost">L</abbr></th>
            <th><abbr title="Goals for">GF</abbr></th>
            <th><abbr title="Goals against">GA</abbr></th>
            <th><abbr title="Goal difference">GD</abbr></th>
            <th><abbr title="Points">Pts</abbr></th>
            <th>Qualification or relegation</th>
          </tr>
        </tfoot>
        <tbody>
          <tr>
            <th>1</th>
            <td><a href="https://en.wikipedia.org/wiki/Leicester_City_F.C." title="Leicester City F.C.">Leicester
                City</a> <strong>(C)</strong>
            </td>
            <td>38</td>
            <td>23</td>
            <td>12</td>
            <td>3</td>
            <td>68</td>
            <td>36</td>
            <td>+32</td>
            <td>81</td>
            <td>Qualification for the <a
                href="https://en.wikipedia.org/wiki/2016%E2%80%9317_UEFA_Champions_League#Group_stage"
                title="2016–17 UEFA Champions League">Champions League group stage</a></td>
          </tr>
        </tbody>
      </table>




      <!-- end Table -->
    </div>
  </div>
</template>

<script>
  import NavBar from '@/components/NavBar.vue'
  import axios from 'axios'

  const appKey = "315c9f5b55e01a3815512c1958910fb7"

  export default {
    components: {
      NavBar
    },

    data() {
      return {
        cityData: null,
        cities: [],
        cityWeather: [],
      }
    },

    methods: {
      /*получение списка городов по выбранной стране*/
      getCityList() {
        bt_1.innerHTML = "загружаю..."
        axios.get(`/sortedList.json`)
          .then(response => {
            this.cities = []
            this.cityData = response.data
            for (let key in this.cityData) {
              if (this.cityData[key].country == selected.value) {
                this.cities.push(this.cityData[key])
              }
            }
            bt_1.innerHTML = "create"
          })
      },

      /*погода в выбранном городе*/
      showWeater(id) {
        axios.get(`https://api.openweathermap.org/data/2.5/weather?id=` + id + "&appid=" + appKey)
          .then(response => {
            this.cityWeather = []
            console.log(response.data)
            this.cityWeather.push("Местоположение: " + response.data.name)
            this.cityWeather.push("Температура: " + Math.round(response.data.main.temp - 273) + "c")
            this.cityWeather.push("Облачность: " + response.data.clouds.all + "%")
            this.cityWeather.push("Скорость ветра: " + response.data.wind.speed + "m/s")
            this.cityWeather.push("Влажность: " + response.data.main.humidity + "%")
            //console.log(this.cityWeather)

            let coeff = () => {
              let curr_lat = parseFloat(response.data.coord.lat)
              console.log(curr_lat)
              let GeoLat = [0, 10, 20, 30, 40, 50, 60, 70, 75, 80, 85]
              let ArrCoeffA = [0.38, 0.40, 0.37, 0.36, 0.38, 0.40, 0.36, 0.18, 0.16, 0.15, 0.14]
              let i = 0;
              let item = 0;
              let index = 0;
              console.log(GeoLat[i])
              while (curr_lat > GeoLat[i]) {
                console.log(GeoLat[i])
                item = GeoLat[i]
                index = i
                i++
              }
              let razGeo = GeoLat[index + 1] - item //разность соседних пунктов широты
              let razCurrLat = curr_lat - item // разность текущей широты и меньшего пункта
              let ratioGeo = razCurrLat / razGeo // отношение разности пунктов к разности текущей широты и меньшего пункта
              let razCoeff = ArrCoeffA[index + 1] - ArrCoeffA[index] // разность правого коэффициента к левому 
              let coeffA = ArrCoeffA[index] + (razCoeff * ratioGeo) // точный коэффициент для текущей широты
              console.log(coeffA)
              let coeffN = parseFloat(response.data.clouds.all)/100
              console.log(coeffN)
              let coeffK = 1 - (coeffA + 0.38 * coeffN) * coeffN
              console.log(coeffK)
              localStorage.setItem('current_coeffK', coeffK)
            };
            coeff()

            localStorage.setItem('current_city', response.data.name)
            localStorage.setItem('current_id', response.data.id)
            localStorage.setItem('current_lat', response.data.coord.lat)
            localStorage.setItem('current_lon', response.data.coord.lon)
            localStorage.setItem('current_temp', Math.round(response.data.main.temp - 273))
            localStorage.setItem('current_clouds', response.data.clouds.all)
            localStorage.setItem('current_wind', response.data.wind.speed)
            localStorage.setItem('current_humidity', response.data.main.humidity)
            //console.log(localStorage.getItem('current_lat'),localStorage.getItem('current_lon'))
          })
      },
      /*погода по координатам*/
      showWeaterByGeoCoordinates(id) {
        //https://api.openweathermap.org/data/2.5/weather?lat=56.732958&lon=37.529302&appid=315c9f5b55e01a3815512c1958910fb7
        axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=` + lat_.value + "&lon=" + lon_.value +
            "&appid=" + appKey)
          .then(response => {
            this.cityWeather = []
            //console.log(response.data)
            this.cityWeather.push("Местоположение: " + response.data.name)
            this.cityWeather.push("Температура: " + Math.round(response.data.main.temp - 273) + "c")
            this.cityWeather.push("Облачность: " + response.data.clouds.all + "%")
            this.cityWeather.push("Скорость ветра: " + response.data.wind.speed + "m/s")
            this.cityWeather.push("Влажность: " + response.data.main.humidity + "%")

            localStorage.setItem('current_city', response.data.name)
            localStorage.setItem('current_lat', response.data.coord.lat)
            localStorage.setItem('current_lon', response.data.coord.lon)
            localStorage.setItem('current_temp', Math.round(response.data.main.temp - 273))
            localStorage.setItem('current_clouds', response.data.clouds.all)
            localStorage.setItem('current_wind', response.data.wind.speed)
            localStorage.setItem('current_humidity', response.data.main.humidity)
            //console.log(this.cityWeather)
          })
      },

      /*поиск в списке городов*/
      FilterInput() {
        let x = filter.value.toLowerCase()
        let Divs = document.querySelectorAll("a.city-items")
        Divs.forEach(el => {
          let elText = el.innerHTML.toLowerCase()
          if (elText.includes(x)) {
            el.classList.remove("hidden")
          } else el.classList.add("hidden")
        })
      },

      /*прогноз 5/3 */
      weatherForecast_5day3hour() {
        let id = localStorage.getItem('current_id')
        axios.get(`https://api.openweathermap.org/data/2.5/forecast?id=` + id + "&appid=" + appKey)
          .then(response => {
            // this.cityWeather = []
            console.log(response.data)
            localStorage.setItem('forecast_5/3', JSON.stringify(response.data))
            /*this.cityWeather.push("Местоположение: " + response.data.name)
            this.cityWeather.push("Температура: " + Math.round(response.data.main.temp - 273) + "c")
            this.cityWeather.push("Облачность: " + response.data.clouds.all + "%")
            this.cityWeather.push("Скорость ветра: " + response.data.wind.speed + "m/s")
            this.cityWeather.push("Влажность: " + response.data.main.humidity + "%")
            //console.log(this.cityWeather)

            localStorage.setItem('current_city', response.data.name)
            localStorage.setItem('current_lat', response.data.coord.lat)
            localStorage.setItem('current_lon', response.data.coord.lon)
            localStorage.setItem('current_temp', Math.round(response.data.main.temp - 273))
            localStorage.setItem('current_clouds', response.data.clouds.all)
            localStorage.setItem('current_wind', response.data.wind.speed)
            localStorage.setItem('current_humidity',response.data.main.humidity)
            //console.log(localStorage.getItem('current_lat'),localStorage.getItem('current_lon'))*/
          })
      },
    }
  }

</script>

<style>
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
    max-height: 50vh;
    overflow: auto;
  }

  .city-items {
    display: block;
    cursor: pointer;
  }

  .hidden {
    display: none;
  }

  .weather-current {
    padding: 0 2em;
  }

  .weather-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
  }

  .weather-items {
    width: 100%;
  }

</style>
