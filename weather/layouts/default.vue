<template>
  <div>
    <nav-bar />
    <nuxt />
    <footer_ />
  </div>
</template>

<script>
  import NavBar from '@/components/NavBar.vue'
  import Footer_ from '@/components/Footer.vue'
  import axios from 'axios'

  export default {
    data() {
      return {}
    },
    head: {
      meta: [{
          charset: 'utf-8'
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1'
        }
      ],
      link: [{
      
      }],
      script: [{
          src: 'https://cdn.jsdelivr.net/npm/chart.js@2.8.0'
        }
      ]
    },
    mounted: function () {
      localStorage.setItem('CoefAtm', 0.106)
      localStorage.setItem('Io', 1395)
      localStorage.setItem('Hr', 180)
      localStorage.setItem('Br', 150)
      if (localStorage.getItem('current_weather') !== null) {
        //console.log('Done!')
      } else {
        this.show() //console.log('None!, loading...')
      }
    },
    /*mounted: function () {

    },*/
    methods: {
      show() {
        const id = 524901
        const appKey = "315c9f5b55e01a3815512c1958910fb7"
        axios.get(`https://api.openweathermap.org/data/2.5/weather?id=` + id + "&appid=" + appKey)
          .then(response => {
            this.cityWeather = []

            //console.log(response.data)
            this.cityWeather.push("Местоположение: " + response.data.name)
            this.cityWeather.push("Температура: " + Math.round(response.data.main.temp - 273) + "c")
            this.cityWeather.push("Облачность: " + response.data.clouds.all + "%")
            this.cityWeather.push("Скорость ветра: " + response.data.wind.speed + "m/s")
            this.cityWeather.push("Влажность: " + response.data.main.humidity + "%")
            let getNumberOfTheDay = () => {
              let now = new Date()
              var dd = now.getDate()
              var mm = now.getMonth() + 1
              var yy = now.getFullYear() % 100
              //console.log(dd, mm, yy)
              let Monthes = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
              let N = 0
              let i = 0
              while (i != mm - 1) {
                N += Monthes[i]
                i++
              }
              if (((yy % 4 == 0 && yy % 100 != 0) || yy % 400 == 0) && mm > 2) N++;
              //console.log(N+dd)
              //return (N + dd)
              localStorage.setItem('current_numberOfTheDay', N + dd)
            }
            getNumberOfTheDay()
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
              localStorage.setItem('current_coeffA', coeffA)
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
                //console.log(MAX_S90)
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

              //console.log('hh', hh)
              let coefficients = sinHDate(hh)

              //console.log(coefficients)
              console.log(coefficients)
              return coefficients.deltaT
            }

            /*------------------------------------- end rail -----------------------------------------*/
            coeff()


            let myObject = new Object
            myObject.dt = Math.round(new Date().getTime() / 1000)
            myObject.timezone = -(new Date().getTimezoneOffset() * 60)
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
          })
      }
    },

    components: {
      NavBar,
      Footer_
    },

    transition: 'page'
  }

</script>


<style>
  /*html{
  background-color: rgb(34, 34, 34);
}*/

</style>
