<template>
  <div>
    <div v-if="!loading" class="notification is-success">
      Прогноз получен!
    </div>
    <div v-if="loading" class="notification is-warning">
      Загрузка...
    </div>
    <!-- <div class="ct-chart " style="width:100%; height:350px;" id="chart1"></div> -->

    <div class="tile is-ancestor">
      <div class="tile is-12 is-vertical is-parent">

        <!--  <div class="tile is-child box">
          <p class="title">Прогноз</p>
          <p class="subtitle">на 5 дней каждые 3 часа</p>
          <button id="button" class="button is-primary is-fullwidth"
            v-on:click="weatherForecast_5day3hour()">Прогноз</button>
        </div> -->
        <progress v-if="loading" class="progress is-small is-info" max="100"></progress>

        <!-- canvas -->
        <canvas id="myChart"></canvas>
        <!-- end canvas -->

        <!-- CHARTIST -->

        <!-- chartist -->
        <!--  {{ props_table_tr}}
        <div v-if="successRequest" class="table-container">
          <table class="table is-fullwidth  is-striped is-hoverable">
            <thead style="position: sticky;">
              <tr>
                <th><abbr title="Date">Дата</abbr></th>
             
                <th><abbr title="Rail">Рельс</abbr></th>
                <th><abbr title="Cloud">Облачность</abbr></th>
                <th><abbr title="Wind">Температура</abbr></th>
                <th><abbr title="Temp">Ветер</abbr></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="tr in props_table_tr">
                <th>{{tr.date_txt}}</th>
              
                <th>{{tr.main.rail + '°C'}}</th>
                <td>{{tr.main.clouds + '%'}}</td>
                <td>{{tr.main.temp + '°C'}}</td>
                <td>{{tr.main.wind + 'м/с'}}</td>
              </tr>
            </tbody>
          </table>
        </div>-->

        <div v-if="successRequest" class="table-container">
          <table class="table is-fullwidth  is-striped is-hoverable">
            <thead style="position: sticky;">
              <tr>
                <th><abbr title="Date">Дата</abbr></th>
                <th><abbr title="">Погода</abbr></th>
                <th><abbr title="Rail">Рельс</abbr></th>
                <th><abbr title="Cloud">Облачность</abbr></th>
                <th><abbr title="Wind">Температура</abbr></th>
                <th><abbr title="Temp">Ветер</abbr></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(tr, icon) in table_tr">
                <th>{{tr.date_txt}}</th>
                <th style="padding:0"><img :src="tr.icon_link" width="40px"></th>
                <th>{{tr.main.rail + '°C'}}</th>
                <td>{{tr.main.clouds + '%'}}</td>
                <td>{{tr.main.temp + '°C'}}</td>
                <td>{{tr.main.wind + 'м/с'}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  const appKey = "315c9f5b55e01a3815512c1958910fb7"
  var chart = null
  export default {

    data() {
      return {
        successRequest: false,
        loading: false,
        table_tr: [],
      }
    },
    props: ['title', 'props_table_tr'],
    mounted: function () {
      if (localStorage.getItem('current_weather') !== null) {
        this.weatherForecast_5day3hour()
      }
      //this.chartistJS()
    },
    methods: {
      chartistJS(data) {
        /*let dates = []
        let rail_temp = []
        let temp = []
        console.log(data)
        for (let i = 0; i < 10; i++) {
          dates.push(data[i].date_txt_chart)
          rail_temp.push(data[i].main.rail)
          temp.push(data[i].main.temp)
        }
        var chart = new Chartist.Line('.ct-chart', {
          labels: dates,
          series: [
            rail_temp, temp
          ]
        }, {

          showArea: true,
          showPoint: true,
          fullWidth: false,
        })



        /*chart.on('draw', function (data) {
          if (data.type === 'line' || data.type === 'area') {
            data.element.animate({
              d: {
                begin: 1000 * data.index,
                dur: 1000,
                from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
                to: data.path.clone().stringify(),
                easing: Chartist.Svg.Easing.easeOutQuint
              }
            });
          }
        });*/
      },
      chartJS(data) {
        let dates = []
        let rail_temp = []
        let temp = []
        for (let i in data) {
          dates.push(data[i].date_txt_chart)
          rail_temp.push(data[i].main.rail)
          temp.push(data[i].main.temp)
        }
        console.log(dates)
        console.log(rail_temp)
        console.log(temp)
        var ctx = document.getElementById('myChart').getContext('2d');

        if (chart !== null) {
          chart.destroy()
          console.log('reseted!')
        }
        chart = new Chart(ctx, {
          // The type of chart we want to create
          type: 'line',

          // The data for our dataset
          data: {
            labels: dates,
            datasets: [{
              label: 'Температура воздуха',
              backgroundColor: 'rgba(255, 99, 132, 0.0)',
              borderColor: 'rgb(255, 99, 132)',
              data: temp
            }, {
              label: 'Температура рельса',
              backgroundColor: 'rgba(65, 99, 132, 0.0)',
              borderColor: 'rgb(65, 99, 132)',
              data: rail_temp
            }]
          },

          // Configuration options go here
          options: {}
        });

      },

      weatherForecast_5day3hour() {
        let id = (JSON.parse(localStorage.getItem('current_weather'))).city.id
        this.loading = true
        //button.classList.add('is-loading')
        axios.get(`https://api.openweathermap.org/data/2.5/forecast?id=` + id + "&appid=" + appKey)
          .then(response => {
            localStorage.setItem('forecast_5/3', JSON.stringify(response.data))
            this.forecast_calcSinH()
            //button.classList.remove('is-loading')
            this.successRequest = true;
            this.loading = false;
          })
      },

      forecast_calcSinH() {
        let dataDays = JSON.parse(localStorage.getItem('forecast_5/3'))
        let lat = parseFloat(dataDays.city.coord.lat)
        let Monthes = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        let CoefAtm = parseFloat(localStorage.getItem('CoefAtm'))
        let Io = parseInt(localStorage.getItem('Io'))
        let Br = parseInt(localStorage.getItem('Br'))
        let Hr = parseInt(localStorage.getItem('Hr'))
        let Smax = parseFloat(localStorage.getItem('max_s90_365'))
        let coeffA = parseFloat(localStorage.getItem('current_coeffA'))
        let timezone = dataDays.city.timezone
        let current_timezone = (new Date().getTimezoneOffset()) * 60

        let numberDayDate = (d, m, y) => {
          let N = 0
          let i = 0
          while (i != m - 1) {
            N += Monthes[i]
            i++
          }
          if (((y % 4 == 0 && y % 100 != 0) || y % 400 == 0) && m > 2) N++;
          //console.log('numberDay: ', N + d)
          return (N + d)
        };

        let tauDate = (hour) => {
          let difference = 12 - hour
          let degree = difference * 15
          //console.log(degree)
          return (degree)
        };

        let sinHDate = (dd, mm, yy, hh, clouds) => {
          let dayDate = numberDayDate(dd, mm, yy)
          let delta = 23.45 * Math.sin((360 * (284 + dayDate) / 365) * Math.PI / 180);
          let k1 = 1.7
          let k2 = 1.7
          if (hh == 12) {
            k1 = 2
          }
          let coeffN = clouds / 100
          let coeffK = 1 - (coeffA + 0.38 * coeffN) * coeffN


          let tau = tauDate(hh)

          let sinH = Math.sin(lat * Math.PI / 180) *
            Math.sin(delta * Math.PI / 180) +
            Math.cos(lat * Math.PI / 180) *
            Math.cos(delta * Math.PI / 180) *
            Math.cos(tau * Math.PI / 180);
          //console.log('sinH', sinH)
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

          let cosQ90 = Math.cos(sunHight * Math.PI / 180) * Math.abs(Math.sin((180 - tau - 90) * Math.PI / 180))
          //console.log('cosQ90 ', cosQ90)

          let S0ver = Sort * cosQ0
          //console.log('S0ver ', S0ver)

          let S90ver = Sort * cosQ90
          //console.log('S90ver ', S90ver)

          let S0 = k1 * (Sgor * Br + S0ver * Hr) / 2000
          //console.log('S0 ', S0)

          let S90 = k2 * (Sgor * Br + S90ver * Hr) / 2000
          // console.log('S90 ', S90)

          let S = 0.5 * (S0 + S90)
          //console.log('S ', S)
          //console.log("")
          let deltaT90 = (S90 * 25) / Smax * coeffK
          let deltaT0 = (S0 * 25) / Smax * coeffK
          let deltaT90_K = (S90 * 25) / Smax
          let deltaT0_K = (S0 * 25) / Smax
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
            'coeffA': coeffA,
            'coeffK': coeffK,
            'clouds': clouds,
            'coeffN': coeffN,
            'deltaT0_K': deltaT0_K,
            'deltaT90_K': deltaT90_K,
            'deltaT0': deltaT0,
            'deltaT90': deltaT90,
            'deltaT': deltaT
          }
        }

        //console.log(dataDays)
        let myObject = new Object
        myObject.city = {
          id: dataDays.city.id,
          name: dataDays.city.name
        }
        myObject.list = new Array
        for (let item in dataDays.list) {
          //console.log(dataDays.list[item].dt_txt)


          let date = new Date((dataDays.list[item].dt + current_timezone + timezone) * 1000)
          /*console.log(new Date(dataDays.list[item].dt * 1000))
          console.log(date)
          console.log(date.getDate())
          console.log(date.getMonth() + 1)
          console.log(date.getFullYear())
          console.log(date.getHours())*/
          //let timezone = dataDays.city.timezone / 3600
          let dd = date.getDate()
          let mm = date.getMonth() + 1
          let yy = date.getFullYear()
          let hh = date.getHours()
          let clouds = dataDays.list[item].clouds.all
          let coefficients = sinHDate(dd, mm, yy, hh, clouds)
          myObject.list.push({
            'date': yy + '-' + mm + '-' + dd + ' ' + hh + ':',
            'date_txt': date.toLocaleString(),
            'date_txt_chart': date.getDate() + '.' + (date.getMonth() + 1) + ' ' + date.getHours() + ':00',
            'icon': dataDays.list[item].weather[0].icon,
            'icon_link': "https://openweathermap.org/img/wn/" + dataDays.list[item].weather[0].icon + "@2x.png",
            "main": {
              'temp': Math.round(dataDays.list[item].main.temp - 273),
              'clouds': dataDays.list[item].clouds.all,
              'wind': dataDays.list[item].wind.speed,
              'humidity': dataDays.list[item].main.humidity,
              'rail': (Math.round(dataDays.list[item].main.temp - 273) + coefficients.deltaT).toFixed(1),
            },
            "coefficients": coefficients
          })
        }
        //console.log(myObject)
        this.table_tr = myObject.list
        localStorage.setItem('data_5/3', JSON.stringify(myObject))
        //myChart.update()
        this.chartJS(myObject.list)
        //this.chartistJS(myObject.list)
      },

      /*SMax365() {
        let lat = parseFloat(JSON.parse(localStorage.getItem('current_weather')).city.lat)
        let CoefAtm = parseFloat(localStorage.getItem('CoefAtm'))
        let Io = parseInt(localStorage.getItem('Io'))
        let Br = parseInt(localStorage.getItem('Br'))
        let Hr = parseInt(localStorage.getItem('Hr'))

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

          let cosQ0 = Math.cos(sunHight * Math.PI / 180) * Math.abs(Math.sin((180 - tau) * Math.PI / 180))

          let cosQ90 = Math.cos(sunHight * Math.PI / 180) * Math.abs(Math.sin((180 - tau - 90) * Math.PI / 180))

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
        console.log(MAX_S90)
        localStorage.setItem('max_s90_365', MAX_S90)
      },*/
    }
  }

</script>
